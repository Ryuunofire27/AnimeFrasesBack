const ConnectionsModel = require('../models/connections-model');

const cm = new ConnectionsModel();

class ConnectionsController{
  getAll(){
    return cm.getAll((err, docs) => {
      if(err) return { err };
      return docs;
    });
  }

  save(data){
    cm.save(data, (err, res) => {
      if(err) return err;
      return res;
    });
  }
}

module.exports = ConnectionsController;