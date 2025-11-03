import request from "supertest";
import app from "../src/app.js";
import { jwtFactory, userFactory } from "./factory/userFactory.js";
import { logger } from "../src/lib/logging.js";
import { db } from "../src/lib/database.js";

const login = async (email, password) => {
    return request(app)
        .post("/auth/login")
        .send({ email, password });
};

const getUser = async (email) => {
    const user = await db.user.findUnique({ where: { email } });
    return user
}

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


const register = async (data) => {
    return request(app)
        .post("/auth/register")
        .send(data);
};


describe('POST /auth/register', function () {
    it('should succeed with valid email and password', async function () {
        const data = await userFactory('make', {
            password: "xxxxxxxx"
        });
        const result = await register(data);
        const user = await getUser(data.email);

        expect(result.statusCode).toBe(200);
        expect(result.body.data.email).toBe(data.email);
        expect(user.email).toBe(data.email);
    });

    it('should fail if email already exists', async function () {
        const data = await userFactory('create');
        const result = await register(data);

        expect(result.statusCode).toBe(409);
        expect(result.body.message).toBe("Email already exists");
    });

    it('should fail if email and password are missing', async function () {
        const result = await register({});

        expect(result.statusCode).toBe(400);
        expect(result.body.message).toBe("Validation Error");
    });
});


const profile = async (token) => {
    return request(app)
        .get("/auth/profile")
        .set('Authorization', `Bearer ${token}`);
}

describe('GET /auth/profile', function () {
    it('should succeed with valid token', async function () {
        const user = await userFactory('create');
        const result = await profile(await jwtFactory(user.email));

        expect(result.statusCode).toBe(200);
        expect(result.body.data.email).toBe(user.email);
    })

    it('should fail if token is invalid', async function () {
        const result = await profile("invalid");

        expect(result.statusCode).toBe(401);
        expect(result.body.message).toBe("Unauthorized");
    })
});