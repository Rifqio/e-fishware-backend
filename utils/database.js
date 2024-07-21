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
