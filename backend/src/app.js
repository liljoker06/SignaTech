const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

app.get('/', (_, res) => {
  res.json({
    status: 'ok',
    graphql: '/graphql'
  });
});

module.exports = app;