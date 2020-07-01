const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const router = require('./routes');

const handleMorganNumberValues = (val) => {
  try {
    const value = parseFloat(val);
    if (typeof value !== 'number' || isNaN(value)) return 0;
    return (value / 1000).toFixed(3);
  } catch (e) { return 0; }
};

const handleMorganLogs = (tokens, req, res) => [
  tokens.method(req, res),
  tokens.status(req, res),
  tokens.url(req, res),
  `${handleMorganNumberValues(tokens['response-time'](req, res))}s`,
  handleMorganNumberValues(tokens.res(req, res, 'content-length')), 'KB', '|',
  tokens['user-agent'](req, res),
  `HTTP/${tokens['http-version'](req, res)}`,
  tokens['remote-addr'](req, res), '-',
  tokens['remote-user'](req, res),
  tokens.referrer(req, res),
].join(' ');

const app = express()
  .use(cors())
  .use(morgan(handleMorganLogs))
  .set('trust proxy', 1)
  .disable('x-powered-by')
  .use(bodyParser.urlencoded({ extended: false }))
  .use(helmet({ frameguard: { action: 'deny' } }))
  .use(bodyParser.json({ limit: '50mb', extended: true }))
  .use('/api', router)
  .use('*', (_req, res) => res.status(404).send('Invalid request'));

module.exports = app;
