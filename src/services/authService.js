import { ResponseError } from "../error/responseError.js";
import { db } from "../lib/database.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const login = async (email, password) => {
  const findUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  // if user not found
  if (!findUser) {
    throw new ResponseError(404, "Email not found");
  }

  // check password
  const isPasswordValid = await bcrypt.compare(password, findUser.password);
  if (!isPasswordValid) {
    throw new ResponseError(401, "Invalid password");
  }

  // generate access token
  const accessToken = jwt.sign({
    data: {
      id: findUser.id,
      email: findUser.email,
    },
    exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
  }, process.env.JWT_SECRET_KEY || 'rahasia');

  return {
    accessToken,
    user: findUser
  };
};

export default { login };
