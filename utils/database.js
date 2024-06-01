const { PrismaClient } = require('@prisma/client');
const { Logger } = require('./logger');

const prisma = new PrismaClient({
    log: [{ emit: 'event', level: 'query' }, 'info', 'warn', 'error'],
    errorFormat: 'pretty',
});

async function generateFishId() {
    const lastFish = await prisma.fish.findMany({
        orderBy: {
            id_fish: 'desc',
        },
        take: 1,
    });

    if (lastFish.length === 0) {
        return 'FSH-001';
    }

    const lastId = lastFish[0].id_fish;
    const lastNumber = parseInt(lastId.split('-')[1], 10);
    const newNumber = (lastNumber + 1).toString().padStart(3, '0');

    return `FSH-${newNumber}`;
}

prisma.$use(async (params, next) => {
    if (params.model === 'FishStockTransaction' && params.action === 'create') {
        const { fish_id, warehouse_id, quantity, transaction_type } = params.args.data;

        const fish = await prisma.fish.findUnique({
            where: {
                id_fish_warehouse_id: {
                    id_fish: fish_id,
                    warehouse_id: warehouse_id,
                },
            },
        });

        if (!fish) {
            throw new Error(
                `Fish with id ${fish_id} and warehouse_id ${warehouse_id} not found`
            );
        }

        let newQuantity = fish.quantity;

        if (transaction_type === 'IN') {
            newQuantity += quantity;
            if (newQuantity > fish.max_stock) {
                throw new Error(
                    `Stock exceeds maximum limit of ${fish.max_stock}`
                );
            }
        } else if (transaction_type === 'OUT') {
            newQuantity -= quantity;
            if (newQuantity < fish.min_stock) {
                throw new Error(
                    `Stock falls below minimum limit of ${fish.min_stock}`
                );
            }
        }

        await prisma.fish.update({
            where: {
                id_fish_warehouse_id: {
                    id_fish: fish_id,
                    warehouse_id: warehouse_id,
                },
            },
            data: { quantity: newQuantity },
        });
    }

    return next(params);
});

prisma.$use(async (params, next) => {
    if (params.model === 'Fish' && params.action === 'create') {
        const newId = await generateFishId();
        params.args.data.id_fish = newId;
    }

    return next(params);
});

prisma.$on('query', async (e) => {
    Logger.query(`${e.query} | params: ${e.params}`);
});

module.exports = prisma;
