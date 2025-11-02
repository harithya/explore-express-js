import 'dotenv/config'
import { logger } from "./lib/logging.js";
import app from './app.js';

const port = process.env.PORT || 3000;

app.listen(port, () => {
  logger.info(`App Started on port ${port}`);
});
