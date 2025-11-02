import authService from "../services/authService.js";

const login = async (req, res) => {
  const body = req.body;
  const result = await authService.login(body.email, body.password);
  return res.status(200).json(result);
};

export default { login };
