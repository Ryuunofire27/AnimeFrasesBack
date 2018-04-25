const schema = require('../schemas/personaje-schema');

class CharacterModel {
  getAll(cb, search, limit, page, pop, wh) {
    const limite = limit ? limit : 10;
    const pagina = page ? page : 1;
    const skip = limite * (pagina - 1);
    const order = pop ? (pop === 'abc' ? {name: 'asc'} : { clicks : pop }) : undefined;
    const whe = wh ? wh : '';
    schema.count(search, (err, count) => {
      if (err) cb(err);
      if (count > 0) {
        schema.find(search)
          .where(whe)
          .sort(order)
          .skip(skip)
          .limit(limite)
          .exec((err1, docs) => {
            if (err1) cb(err1);
            const pages = Math.ceil(count / limite);
            cb(null, { count, docs, pages });
          });
      } else {
        cb({ message: 'Not found' });
      }
    });
  }

  getById(id, cb) {
    schema.findById(id, (err, doc) => {
      if (err) cb(err);
      cb(null, doc);
    });
  }

  getPhrasesByCharacter(id, cb) {
    schema.findById(id, '_id phrases imgRelUrl', (err, docs) => {
      if (err) cb(err);
      cb(null, docs);
    });
  }

  getPhraseById(idCharacter, idPhrase, cb) {
    schema.findOne({ _id: idCharacter }, '_id phrases imgRelUrl', (err, docs) => {
      if (err) cb(err);
      const phrase = docs.phrases.filter((val) => {
        if (val._id == idPhrase) return val;
      });
      cb(null, phrase);
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

  saveCharacter(data, cb) {
    schema.count({ name: data.name }, (err, count) => {
      if (err) cb(err);
      if (count === 0) {
        schema.create(data)
          .then(docs => cb(null, { message: 'Insert/Update succesful' }))
          .catch(err1 => cb({ message: 'Error, insert unsuccesful' }));
      } else {
        cb({ message: 'Error, the name character exist' });
      }
    });
  }

  updateCharacter(data, cb) {
    schema.findByIdAndUpdate(data._id, data, (err) => {
      if (err) cb('Error, update character unsuccesful');
      cb(null, 'Update character succesful');
    });
  }

  delete(id, cb) {
    schema.findById(id, (err, doc) => {
      if (err) cb(err);
      schema.findByIdAndRemove(id, (err1) => {
        if (err1) cb(err1);
        cb(null, doc, 'Delete succesful');
      });
    });
  }

  deletePhrase(id, idPhrase, cb) {
    schema.findById(id, (err, docs) => {
      if (err) cb(err);
      let audioPath = null;
      docs.phrases = docs.phrases.filter((val) => {
        if (val._id != idPhrase) {
          return val;
        }
        audioPath = val.audioRelUrl;      
      });
      schema.findByIdAndUpdate(id, docs, (err1) => {
        if (err1) cb('Error, delete unsuccesful');
        cb(null, 'Delete phrase succesful', audioPath);
      });
    });
  }
}

module.exports = CharacterModel;
