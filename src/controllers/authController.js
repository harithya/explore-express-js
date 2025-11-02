import { authService } from "../services/authService.js";
import { loginAuthValidation, registerAuthValidation } from "../validation/authValidation.js";
import { validate } from "../validation/index.js";

const login = async (req, res) => {
  const body = validate(loginAuthValidation, req.body)

  const data = await authService.login(body);
  return res.status(200).json({
    message: "Login Success",
    data
  });
};

const register = async (req, res) => {
  const body = validate(registerAuthValidation, req.body);

  const data = await authService.register(body);
  return res.status(200).json({
    message: "Register Success",
    data
  });
}

export default { login, register };
