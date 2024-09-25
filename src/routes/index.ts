import * as express from 'express';

export const register = (app: express.Application) => {
  app.get('/_healthcheck', (req, res) => {
    res.status(200).json({ now: new Date(), uptime: process.uptime() });
  });
};
