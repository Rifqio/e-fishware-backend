const DB = require('../utils/database');
const bcrypt = require('bcrypt');
const { fakerID_ID } = require('@faker-js/faker');

const SeedFish = async (amount) => {
    for (let i = 0; i < amount; i++) {
        const type = fakerID_ID.animal.fish();
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
        const email = fakerID_ID.internet.email().toLowerCase();
        const fullName = fakerID_ID.person.fullName();
        const employeeId = 'EMP' + fakerID_ID.number.int({ min: 1000, max: 9999 });

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
