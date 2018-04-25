const schema = require('../schemas/connections-schema');

class ConnectionsModel {
  getAll(cb) {
    schema.find({}, (err, docs) => {
      if (err) return cb(err);
      cb(null, docs);
    });
  }

  getById(id, cb) {
    schema.findById(id, (err, doc) => {
      if (err) return cb(err);
      cb(null, doc);
    });
  }

  save(date, cb) {
    schema.count({ date }, (err, count) => {
      if (err) return cb(err);
      if (count === 0) {
        schema.create({_id: null, date: date}, (err1) => {
          if (err1) return cb(err1);
          cb(null, 'Insert successful');
        });
      } else {
        schema.find({ date }, (err2, docs) => {
          if(err2) return cb(err2);
          const data = docs[0];
          data.connections++;
          schema.findByIdAndUpdate(data.id, data, (err, res) => {
            if(err) return cb(err);
            cb(null, res);
          });
        });
      }
    });
  }

  delete(id, cb) {
    schema.findByIdAndRemove(id, (err) => {
      if (err) throw err;
      cb();
    });
  }
}

module.exports = ConnectionsModel;
