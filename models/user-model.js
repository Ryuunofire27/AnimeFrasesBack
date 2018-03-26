const schema = require('../schemas/user-schema');

class UserModel{

  getAll(cb){
    schema.find({},'_id user',(err, docs) => {
      if(err) throw err;
      cb(docs);
    });
  }

  getById(id, cb){
    schema.findById(id, '_id user', (err, docs) => {
      if (err) throw err;
      cb(docs);
    });
  }

  save(data, cb){
    schema.count({user: data.user}, (err, count) => {
      if(err) cb(err);
      if (count === 0) {
        schema.create(data, (err) => {
          if (err) throw err;
          cb('Insert successful');
        });
      }else{
        cb('El usuario ya existe');
      }
    });
  }

  delete(id,cb){
		schema.findByIdAndRemove(id, (err) => {
			if(err) throw err;
			cb();
		});
  }

  login(user, cb){
    schema.findOne(user, '_id user', (err, doc) => {
      if(err) cb('Internal error');
      if(doc){
        console.log(doc);
        cb('Permision granted');
      }else{
        cb('Usuario y contraseña no coinciden');
      }
    });
  }

}

module.exports = UserModel;