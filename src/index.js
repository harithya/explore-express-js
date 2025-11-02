import express from "express";
import { logger } from "./lib/logging.js";
import { router } from "./routes/api.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.use(errorMiddleware);

app.listen(port, () => {
  logger.info(`App Started on port ${port}`);
});
