const express = require('express');
const Client = require('./ftp/ftpClient');
const cRoute = require('./routes/character-route');
const bodyParser = require('body-parser');
const restFul = require('express-method-override')('_method');

const client = new Client();
const app = express();
const port = 8080;


app
  .set('port', port)

  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(restFul);


app.get('/', (req, res, next) => {
  res.send('ingresaste al servidor');
});

app.get('/ftp/:file', async (req, res, next) => {
  const { file } = { file: req.params.file };
  if (file === 'robots.txt' || file === 'favicon.ico') {
    res.end();
  } else {
    await client.getFile(
      file,
      (chunk) => {
        res.write(chunk);
      },
      () => res.send()
      ,
    );
  }
});

app.use('/characters', cRoute);

module.exports = app;
