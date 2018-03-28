const schema = require('../schemas/personaje-schema');

class CharacterModel {
  getAll(cb, limit = 10, page = 1) {
    schema.count({}, (err, count) => {
      if (err) throw err;
      if (count > 0) {
        schema.find({})
          .select('_id id name description anime sex')
          .skip(limit * (page - 1))
          .limit(limit)
          .exec((err1, docs) => {
            if (err1) throw err1;
            cb({ count, docs });
          });
      } else {
        cb({ msg: 'Not found' });
      }
    });
  }

  getById(id, cb) {
    schema.findById(id, (err, doc) => {
      if (err) throw err;
      cb(doc);
    });
  }

  getSearch(search, cb, limit = 5, page = 1) {
    schema.count(search, (err, count) => {
      if (err) throw err;
      if (count > 0) {
        schema.find(search)
          .select('_id id name description anime sex')
          .skip(limit * (page - 1))
          .limit(limit)
          .exec((err1, docs) => {
            if (err1) throw err1;
            cb({ count, docs });
          });
      } else {
        cb({ msg: 'Not found' })
      }
    });
  }

  getPhrasesByCharacter(id, cb) {
    schema.findById(id, 'phrases', (err, docs) => {
      if (err) throw err;
      cb(docs); 
    });
  }

  getPhraseById(idCharacter, idPhrase, cb) {
    schema.findOne({ _id: idCharacter }, 'phrases', (err, docs) => {
      if (err) throw err;
      docs.phrases = docs.phrases.filter((val) => {
        if (val._id == idPhrase) return val;
      });
      cb(docs.phrases); 
    });
  }

  addingClick(id) {
    schema.findById(id, (err, docs) => {
      if (err) throw err;
      docs.clicks = docs.clicks + 1;
      schema.findByIdAndUpdate(id, docs, (err) => {
        if (err) throw err;
      });
    });
  }

  saveCharacter(data, cb, cbErr) {
    schema.count({ name: data.name }, (err, count) => {
      if (err) cbErr(err);
      if (count === 0) {
        schema.create(data)
          .then( docs => cb('Insert/Update succesful'))
          .catch( err =>  cbErr('Error, insert unsuccesful'));
      } else {
        cbErr('Error, the name character exist');
      }
    });
  }

  updateCharacter(data, cb) {
    schema.findByIdAndUpdate(data._id, data, (err) => {
      if (err) cb('Error, update character unsuccesful')
      cb('Update character succesful');
    });
  }

  delete(id, cb) {
    schema.findById(id, (err, doc) => {
      if (err) throw err;
      schema.findByIdAndRemove(id, (err1) => {
        if (err1) throw err1;
        cb(doc, 'Delete succesful');
      }); 
    });
  }
  
  deletePhrase(id, idPhrase, cb) {
    schema.findById(id, (err, docs) => {
      if (err) throw err;
      let audioPath = null;
      docs.phrases = docs.phrases.filter((val) => {
        if (val._id != idPhrase) {
          return val;
        } else {
          audioPath = val.audioRelUrl;
        }
      });
      schema.findByIdAndUpdate(id, docs, (err1) => {
        if (err1) cb('Error, delete unsuccesful');
        cb(audioPath,'Delete phrase succesful');
      });
    });
  }
}

module.exports = CharacterModel;
