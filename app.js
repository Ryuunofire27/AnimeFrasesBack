const express = require('express');
const cRoute = require('./routes/character-route');
const bodyParser = require('body-parser');
const restFul = require('express-method-override')('_method');
const fileUpload = require('express-fileupload');

const app = express();
const port = 3000;


app
  .set('port', port)
  
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(restFul)
  .use(fileUpload())
  .use('/characters', cRoute);

module.exports = app;
