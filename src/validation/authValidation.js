import z from "zod";

const loginAuthValidation = z.object({
    email: z.email().max(255),
    password: z.string().min(6)
})

export {
    loginAuthValidation
}