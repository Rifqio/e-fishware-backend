const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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

module.exports = prisma;
