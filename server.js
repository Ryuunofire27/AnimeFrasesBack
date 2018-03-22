const app = require('./app.js');

const port = app.get('port');

app.listen(port, () => {
  console.log(`El servidor esta corriendo en http://localhost:${port}`);
});
