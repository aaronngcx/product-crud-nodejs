import express from 'express';
import { NextFunction, Request, Response } from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import * as routes from './routes';
import webRoutes from './routes/web';
import apiRoutes from './routes/api';
import session from 'express-session';

const server = express();

server.use(session({
    secret: 'fortitude',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use(favicon(path.join('public', 'favicon.ico')));
server.use(express.static('public'));

// Configure Express to use EJS
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'ejs');

// Configure Express to parse incoming JSON data
server.use(express.json());

// Configure routes
routes.register(server);
server.use('/', webRoutes);
server.use('/api', apiRoutes);

export default server;
