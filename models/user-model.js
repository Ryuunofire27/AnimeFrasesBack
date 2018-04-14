const schema = require('../schemas/user-schema');

class UserModel {
  getAll(cb) {
    schema.find({}, '_id user', (err, docs) => {
      if (err) cb(err);
      cb(docs);
    });
  }

  getById(id, cb) {
    schema.findById(id, '_id user', (err, docs) => {
      if (err) cb(err);
      cb(null, docs);
    });
  }

  save(data, cb) {
    schema.count({ user: data.user }, (err, count) => {
      if (err) cb(err);
      if (count === 0) {
        schema.create(data, (err1) => {
          if (err1) cb(err1);
          cb(null, 'Insert successful');
        });
      } else {
        cb(null, 'El usuario ya existe');
      }
    });
  }

  delete(id, cb) {
    schema.findByIdAndRemove(id, (err) => {
      if (err) cb(err);
      cb();
    });
  }

  login(user, cb) {
    schema.findOne(user, '_id user', (err, doc) => {
      if (err) cb({ err: 'Internal error' });
      if (doc) {
        cb(null, null, doc);
      } else {
        cb(null, { msg: 'Usuario y contraseña no coinciden' });
      }
    });
  }
}

module.exports = UserModel;
