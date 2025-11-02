import expres from "express";
import { logger } from "./lib/logging.js";
import { router } from "./routes/api.js";

const app = expres();
const port = 3000;

app.use(router);

app.listen(port, () => {
  logger.info(`App Started on port ${port}`);
});
