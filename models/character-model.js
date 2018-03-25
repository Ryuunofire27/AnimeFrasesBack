const schema = require('../schemas/personaje-schema');
const PhrasesModel = require('../models/phrases-model');

const pm = new PhrasesModel();
let s = new schema();

class CharacterModel{

  getAll(limit = 10, page = 1, cb){
    schema.find({})
    .select('_id name description anime sex')
    .limit(limit * (page - 1))
    .exec((err, docs) => {
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

  getSearch(limit = 5, page = 1, cb){
    schema.find(search)
    .select('_id name description')
    .limit(limit * (page - 1))
    .exec((err, docs) => {
      if(err) throw err;
      cb(docs);
    });
  }

  getPhrasesByCharacter(id, cb){
    schema.findById(id,'phrases', (err, docs) => {
      if (err) throw err;
      cb(docs); 
    });
    
  }

  getPhraseById(idCharacter, idPhrase, cb){
    schema.findOne({_id: idCharacter/*, phrases: [{_id : idPhrase}]*/}, 'phrases', (err, docs) => {
      if (err) throw err;
      docs.phrases = docs.phrases.filter((val) => {
        console.log(val);
        if(val._id == idPhrase) return val;
      });
      cb(docs.phrases); 
    });
  }

  addingClick(id){
    schema.findById(id, (err, docs) => {
      if(err) throw err;
      docs.clicks = docs.clicks + 1;
      schema.findByIdAndUpdate(id, docs, (err) => {
        if(err) throw err;
      });
    });
  }

  saveCharacter(data, cb, cbErr){
    schema.count({name: data.name}, (err, count) => {
      if (err) cbErr('El personaje ya existe');
      if (count === 0) {
        schema.create(data)
          .then( docs => cb('Insert/Update succesful'))
          .catch( err =>  cbErr('Error, insert unsuccesful'));
      }else{
        cbErr('Error, the name character exist');
      }
    });
  }

  delete(id,cb){
		schema.findByIdAndRemove(id, (err) => {
			if(err) cb('Error, delete unsuccesful');
      cb('Delete succesful');
		});
  }
  
  deletePhrase(id, idPhrase, cb){
    schema.findById(id, (err, docs) => {
      if(err) throw err;
      docs.phrases = docs.phrases.filter((val) => {
        if(val._id != idPhrase) return val
      });
      schema.findByIdAndUpdate(id, docs, (err) => {
        if(err) cb('Error, delete unsuccesful');
        cb('Delete phrase succesful');
      });
    });
  }

}

module.exports = CharacterModel;
