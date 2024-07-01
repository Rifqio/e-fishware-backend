const DB = require('../utils/database');
const bcrypt = require('bcrypt');
const { fakerID_ID } = require('@faker-js/faker');

const SeedFish = async (amount) => {
    for (let i = 0; i < amount; i++) {
        const type = fakerID_ID.animal.fish();
        const price = fakerID_ID.number.float({ min: 1000, max: 100000 });
        await DB.fish.create({
            data: {
                type: type,
                price: price,
            },
        });
    }
};

const SeedUser = async (amount) => {
    for (let i = 0; i < amount; i++) {
        const hashedPassword = await bcrypt.hash('password', 10);
        const email = fakerID_ID.internet.email().toLowerCase();
        const fullName = fakerID_ID.person.fullName();
        const employeeId =
            'EMP' + fakerID_ID.number.int({ min: 1000, max: 9999 });

        await DB.user.create({
            data: {
                email: email,
                password: hashedPassword,
                full_name: fullName,
                employee_id: employeeId,
            },
        });
    }
};

const SeedWarehouse = async () => {
    for (let i = 0; i < 3; i++) {
        const warehouseName = 'Gudang ' + fakerID_ID.location.city();
        await DB.warehouse.create({
            data: {
                name: warehouseName,
            },
        });
    }
};

module.exports = {
    SeedFish,
    SeedUser,
    SeedWarehouse
};
