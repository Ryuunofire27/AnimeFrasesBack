const schema = require('../schemas/personaje-schema');
const ftpClient = require('../ftp/ftpClient');

class CharacterModel{

  getAll(cb){
    schema.find({}, (err, docs) => {
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
      cb(docs); 
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

  saveCharacter(data, cb){
    schema.count({_id: data._id}, (err, count) => {
      if (err) throw err;
      const imgRelUrl = ftpClient.putFile('img', data.img);
      const phrases = [];
      data.phrases.map((phrase) => {
        const audio = ftpClient.putFile('audio', phrase.audio);
        phrases.push({
          phrase: phrases.phrase,
          audio : audio
        });
      });
      const popularColor = 'black';
      const contrastColor = 'white';
      const character = {
        _id : data._id,
        clicks: data.cllicks,
        name : data.name,
        description : [
          data.anime,
          data.sex
        ],
        popularColor,
        contrastColor,
        imgRelUrl,
        phrases
      };
      if (count === 0) {
        schema.create(character, (err) => {
          if (err) throw err;
          cb();
        });
      } else if (count === 1) {
        schema.findByIdAndUpdate(data.id, character, (err) => {
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
  
  deletePhrase(id, idPhrase, cb){
    schema.findById(id, (err, docs) => {
      if(err) throw err;
      docs.phrases = docs.phrases.filter((val) => {
        if(val._id != idPhrase) return val
      });
      schema.findByIdAndUpdate(id, docs, (err) => {
        if(err) throw err;
        cb();
      });
    });
  }

}

module.exports = CharacterModel;
