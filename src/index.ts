import dotenv from 'dotenv-safe';
import logger from './core/logger';
import server from './server';

dotenv.config({
  example: process.env.CI ? '.env.ci.example' : '.env.example',
});

const port = process.env.SERVER_PORT || 3000; // default port to listen

// start the Express server
server.listen(port, () => {
  logger.info(`server started at http://localhost:${port}`);
});
