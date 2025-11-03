import { faker } from '@faker-js/faker';
import { db } from "../../src/lib/database.js"
import jwt from "jsonwebtoken"
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

export const jwtFactory = async (email) => {
    const user = await db.user.findUnique({ where: { email } });
    const accessToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET_KEY || "rahasia",
        { expiresIn: 60 * 60 }
    );

    return accessToken;
}