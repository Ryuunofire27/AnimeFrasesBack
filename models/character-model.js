const schema = require('../schemas/personaje-schema');

class CharacterModel {
  getAll(cb, limit, page, pop, wh) {
    const limite = limit ? limit : 10;
    const pagina = page ? page : 1;
    const skip = limite * (pagina - 1);
    const order = pop ? { clicks : pop } : undefined;
    const whe = wh ? wh : '';
    schema.count({}, (err, count) => {
      if (err) throw err;
      if (count > 0) {
        schema.find()
          //.select('_id id name description anime sex imgRelUrl clicks')
          .where(whe)
          .sort(order)
          .skip(skip)
          .limit(limite)
          .exec((err1, docs) => {
            if (err1) throw err1;
            const pages = Math.ceil(count / limite);
            cb({ count, docs, pages });
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

  getSearch(search, cb, limit, page, pop, wh) {
    const limite = limit ? limit : 5;
    const pagina = page ? page : 1;
    const skip = limite * (pagina - 1);
    const order = pop ? { clicks : pop } : undefined;
    const whe = wh ? wh : '';
    schema.count(search, (err, count) => {
      if (err) throw err;
      if (count > 0) {
        schema.find(search)
          //.select('_id id name description anime sex imgRelUrl clicks')
          .skip(limit * (page - 1))
          .limit(limite)
          .exec((err1, docs) => {
            if (err1) throw err1;
            const pages = Math.ceil(count / limite);
            cb({ count, docs, pages});
          });
      } else {
        cb({ msg: 'Not found' });
      }
    });
  }

  getPhrasesByCharacter(id, cb) {
    schema.findById(id, '_id phrases imgRelUrl', (err, docs) => {
      if (err) throw err;
      cb(docs);
    });
  }

  getPhraseById(idCharacter, idPhrase, cb) {
    schema.findOne({ _id: idCharacter }, '_id phrases imgRelUrl', (err, docs) => {
      if (err) throw err;
      const phrase = docs.phrases.filter((val) => {
        if (val._id == idPhrase) return val;
      });
      cb(phrase);
    });
  }

  addingClick(id, cb) {
    schema.findById(id, (err, docs) => {
      if (err) cb(err);
      docs.clicks = docs.clicks + 1;
      schema.findByIdAndUpdate(id, docs, (err1) => {
        if (err1) cb(err1);
        cb();
      });
    });
  }

  saveCharacter(data, cb, cbErr) {
    schema.count({ name: data.name }, (err, count) => {
      if (err) cbErr(err);
      if (count === 0) {
        schema.create(data)
          .then(docs => cb('Insert/Update succesful', docs))
          .catch(err1 => cbErr('Error, insert unsuccesful', err1));
      } else {
        cbErr('Error, the name character exist');
      }
    });
  }

  updateCharacter(data, cb) {
    schema.findByIdAndUpdate(data._id, data, (err) => {
      if (err) cb('Error, update character unsuccesful');
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
        }
        audioPath = val.audioRelUrl;      
      });
      console.log(docs.phrases);
      schema.findByIdAndUpdate(id, docs, (err1) => {
        if (err1) cb('Error, delete unsuccesful');
        cb('Delete phrase succesful', audioPath);
      });
    });
  }
}

module.exports = CharacterModel;
