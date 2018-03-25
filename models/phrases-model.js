const schema = require('../schemas/phrases-schema');

class PhrasesModel{

  getAll(idCharacter, cb){
    schema.find({idCharacter: idCharacter} ,(err, docs) => {
      if(err) throw err;
      cb(docs);
    });
  }

  getById(id, cb){
    schema.findById(id, (err, docs) => {
      if (err) throw err;
      cb(docs);
    });
  }

  save(data, cb, cbErr){
    schema.count({_id: data._id}, (err, count) => {
      if(err) cbErr('El personaje ya existe');
      if (count === 0) {
        schema.create(character, (err) => {
          if (err) throw err;
          cb();
        });
      }
    });
  }

  delete(id,cb){
		schema.findByIdAndRemove(id, (err) => {
			if(err) throw err;
			cb();
		});
  }

}

module.exports = PhrasesModel;
