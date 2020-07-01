/* eslint-disable prefer-arrow-callback, func-names, no-console */
const winston = require('winston');

/**
 * Default response to internal server error
 * @description Log error and send '500 - Internal Server Error.'
 * @param {Error} error
 * @param {Response} res
 */
const ResponseError = (error, res) => {
  winston.error(error.message, error);
  return res.status(400).send('Something went wrong.');
};

/**
 * Return API port
 * @param {String | Number} val
 */
const normalizePort = (val) => {
  const port = typeof val === 'string' ? parseInt(val) : val;
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
};

/**
 * Handle server error
 * @param {Error} error
 */
const onError = (error) => {
  const splitedMessage = error.message.split(': ');
  console.error(`\n[${splitedMessage[0].toUpperCase()}]: ${splitedMessage[1]}\n`);
  process.exit(1);
};

/**
 * Handle startup server
 * @param {any} server HTTP server
 */
const onListening = server => () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  return console.log(`
+===========================================+
|                  GLB API!                 |
+===========================================+
|         Listening at ${bind}...         |
|                                           |
+===========================================+
`);
};

const onExit = (worker, code, signal) => {
  const workerPid = worker.process.pid;
  if (signal) return console.log(`worker ${workerPid} was killed by signal: ${signal}`);
  if (code !== 0) return console.log(`worker ${workerPid} exited with error code: ${code}`);
  return console.log(`worker ${workerPid} died`);
};

const onClusterListening = (worker, address) => {
  const workerPid = worker.process.pid;
  console.log(`A worker ${workerPid} is now connected to ${address.address}:${address.port}`);
};

module.exports = { ResponseError, normalizePort, onError, onListening, onExit, onClusterListening };
