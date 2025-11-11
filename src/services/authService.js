import { ResponseError } from "../error/responseError.js";
import { db } from "../lib/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { mail, withHtml } from "../lib/mail.js";
import { logger } from "../lib/logging.js";

const JWT_SECRET = process.env.JWT_SECRET_KEY || "rahasia";
const TOKEN_EXPIRES_IN = 60 * 60; // 1 jam

export const authService = {
  async login({ email, password }) {
    const user = await db.user.findUnique({ where: { email } });

    if (!user) throw new ResponseError(404, "Email not found");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new ResponseError(401, "Invalid password");

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRES_IN }
    );

    return {
      accessToken,
      user: user
    };
  },

  async register({ email, password, ...rest }) {
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) throw new ResponseError(409, "Email already exists");

    const emailToken = Math.random().toString(36).substring(2, 15);

    await mail.sendMail({
      from: process.env.MAIL_FROM_USER,
      to: email,
      subject: "Register Success",
      html: withHtml('verification', {
        name: rest.name,
        verification_url: `${process.env.APP_URL}/auth/verify-email?token=${emailToken}`,
      })
    });

    const hashedPassword = await bcrypt.hash(password, 10);
    logger.info('Payload for new user', {
      email,
      password: hashedPassword,
      emailVerifyToken: emailToken,
      ...rest
    });
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        emailVerifyToken: emailToken,
        ...rest
      }
    });

    return user;
  },

  async getProfile(id) {
    const user = await db.user.findUnique({
      where: { id }
    });

    return user;
  }
};
