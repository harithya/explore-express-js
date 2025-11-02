import authService from "../services/authService.js";
import { loginAuthValidation } from "../validation/authValidation.js";
import { validate } from "../validation/index.js";

const login = async (req, res, next) => {
  const body = validate(loginAuthValidation, req.body)

  const data = await authService.login(body.email, body.password);
  return res.status(200).json({
    message: "Login Success",
    data
  });
};

export default { login };
