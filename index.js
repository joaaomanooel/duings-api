/* eslint-disable no-console */
require('dotenv').config();
const { cpus } = require('os');
const cluster = require('cluster');
const http = require('http');

const { normalizePort, onExit, onClusterListening } = require('./src/utils');
const app = require('./src');

const PORT = normalizePort(process.env.PORT || 3000);
const server = http.createServer(app);

const startup = () => {
  if (!cluster.isMaster) return server.listen(PORT);

  console.log(`
    +===========================================+
    |                duings API!                |
    +===========================================+
    |           Listening at ${PORT}...            |
    |                                           |
    +===========================================+
  `);

  cluster.on('listening', onClusterListening);
  cpus().forEach(() => cluster.fork());

  return cluster.on('exit', onExit);
};

startup();
