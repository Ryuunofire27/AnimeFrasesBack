const express = require('express');
const routes = require('./routes/routes');
const bodyParser = require('body-parser');
const restFul = require('express-method-override')('_method');
const fileUpload = require('express-fileupload');
const cors = require('./middlewares/cors');
const http = require('http');

const app = express();
const server = http.createServer(app);
const port = 3000;
const public = express.static(`${__dirname}/public`);

app
  .set('port', port)
  .set('server', server)
  .use(cors())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(restFul)
  .use(fileUpload())
  .use(public)
  .get('/', (req, res, next) => {
    res.send('index.html');
  })
  .use(routes);

module.exports = app;
