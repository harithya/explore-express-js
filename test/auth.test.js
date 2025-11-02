import request from "supertest";
import app from "../src/app.js";
import { userFactory } from "./factory/userFactory.js";
import { logger } from "../src/lib/logging.js";

const login = async (email, password) => {
    return request(app)
        .post("/auth/login")
        .send({ email, password });
};

describe("POST /auth/login", function () {
    it("should succeed with valid email and password", async function () {
        const user = await userFactory("create");
        const result = await login(user.email, "password");

        expect(result.statusCode).toBe(200);
        expect(result.body.data.accessToken).toBeDefined();
        expect(result.body.data.user.email).toBe(user.email);
    });

    it("should fail if email is invalid", async function () {
        const user = await userFactory("make"); // not saved
        const result = await login(user.email, "password");

        expect(result.statusCode).toBe(404);
        expect(result.body.message).toBe("Email not found");
    });

    it("should fail if password is invalid", async function () {
        const user = await userFactory("create");
        const result = await login(user.email, "wrongpassword");

        logger.info(user);
        expect(result.statusCode).toBe(401);
        expect(result.body.message).toBe("Invalid password");
    });

    it("should fail if email and password are missing", async function () {
        const result = await login("", "");

        expect(result.statusCode).toBe(400);
        expect(result.body.message).toBe("Validation Error");
    });
});
