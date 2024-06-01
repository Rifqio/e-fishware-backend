const DB = require('../utils/database');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

const SeedFish = async (amount) => {
    for (let i = 0; i < amount; i++) {
        const type = faker.animal.fish();
        await DB.fish.create({
            data: {
                type: type,
            },
        });
    }
};

const SeedUser = async (amount) => {
    for (let i = 0; i < amount; i++) {
        const hashedPassword = await bcrypt.hash('password', 10);
        const email = faker.internet.email().toLowerCase();
        const fullName = faker.person.fullName();
        const employeeId = 'EMP' + faker.number.int({ min: 1000, max: 9999 });

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
module.exports = {
    SeedFish,
    SeedUser,
};
