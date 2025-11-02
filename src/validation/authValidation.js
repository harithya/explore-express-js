import z from "zod";

const loginAuthValidation = z.object({
    email: z.email().max(255),
    password: z.string().min(6)
}).strip();

const registerAuthValidation = z.object({
    name: z.string().max(255),
    email: z.email().max(255),
    password: z.string().min(6)
}).strip();

export {
    loginAuthValidation,
    registerAuthValidation
}