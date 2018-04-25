const app = require('./app.js');
const Socket = require('./socket/socket');

const port = app.get('port');
const server = app.get('server');
const io = new Socket(server);
let connections = 0;

server.listen(port, () => {
  console.log(`El servidor esta corriendo en http://localhost:${port}`);
});

io.start();
