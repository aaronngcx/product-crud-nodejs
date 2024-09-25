import Sequelize from 'sequelize';
import logger from '../core/logger';
import { DbInterface } from '../typings/DbInterface';

const env = process.env.NODE_ENV || 'development';
// tslint:disable-next-line: no-var-requires
const config = require(__dirname + '/../config/database.js')[env];

if (process.env.NODE_ENV === 'development') {
  config.logging = (msg: any) => {
    logger.debug(msg);
  };
}

const sequelize = new Sequelize.Sequelize(config.database, config.username, config.password, config);

const db: DbInterface = {
  sequelize,
};

export default db;
