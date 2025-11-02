import { db } from "../lib/database.js";

const login = async (email, password) => {
  const findUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  return findUser;
};

export default { login };
