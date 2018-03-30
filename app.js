const express = require('express');
const routes = require('./routes/routes');
const bodyParser = require('body-parser');
const restFul = require('express-method-override')('_method');
const fileUpload = require('express-fileupload');
const cors = require('./middlewares/cors');

const app = express();
const port = 3000;
const public = express.static(`${__dirname}/public`);


app
  .set('port', port)
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
