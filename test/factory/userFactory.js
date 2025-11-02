import { faker } from '@faker-js/faker';
import { db } from "../../src/lib/database.js"
import bcrypt from "bcrypt"

export const userFactory = async (type = "create", overide = {}) => {
    const password = await bcrypt.hash('password', 10);
    const dummy = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: password,
        ...overide
    };

    return type === "create" ? db.user.create({ data: dummy }) : dummy
}