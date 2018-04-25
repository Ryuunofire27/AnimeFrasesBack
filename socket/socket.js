const socket = require('socket.io');
const ConnectionsModel = require('../models/connections-model');

const cm = new ConnectionsModel();

class ConnectionsSocket{
  constructor(server){
    this.io = socket(server);
  }

  start(){
    this.io.on('connection', (socket) => {
      const date = new Date();
      const today = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      cm.save(today, (err, res) => {
        if(err) return console.log(err);
        console.log(res);
        socket.broadcast.emit('connections', res);
      });
      socket.on('get connections', () => {
        cm.getAll((err, docs) => {
          if(err) return console.log(err);
          socket.emit('get connections', docs);
        });
      });
    });
  }
}

module.exports = ConnectionsSocket;