const CharacterModel = require('../models/character-model');
const fs = require('fs');
const ColorExtract = require('../util/extract-color');

const directory = '/var/animefrases';
const ce = new ColorExtract();
const cm = new CharacterModel();

const format = (name) => {
  const date = new Date();
  return `${date.getTime()}_${name}`;
};

const getArrPhrasesPart = (keys, values, part) => {
  if (!keys || !values || !part) throw new Error('Send all parameters');
  let j = 0;
  const arr = [];
  for (let i = 0; i < keys.length; i++) {
    if (keys[i] === `${part}_${j}`) {
      arr.push(values[i]);
      j++;
    }
  }
  return arr;
};

const deleteFile = (filePath, err1) => {
  fs.stat(filePath, (err) => {
    if (!err) {
      fs.unlink(filePath, (err) => {
        if (!err) console.log('eliminado con exito');
      });
    }
  });
};

const existDirectory = (fileDirectory, cb) => {
  fs.readdir(`${directory}/${fileDirectory}`, (err) => {
    if (err) {
      fs.mkdirSync(`${directory}/${fileDirectory}`);
    }
    if (cb) {
      cb();
    }
  });
}

const addPhrases = (phrases, phrasesArr, audiosArr, animeDirectory) => {
  for (let i = 0; i < phrasesArr.length; i++) {
    const audioPath = `${directory}/audio/${animeDirectory}/${format(audiosArr[i].name)}`
    audiosArr[i].mv(audioPath, (err) => {
      if(err) deleteFile(audioPath, err);
    });
    phrases.push({
      phrase: phrasesArr[i],
      audioRelUrl: audioPath.split(directory+'/')[1]
    });
  }
}

class CharacterController {

	getAll(req, res) {
    const search = req.query.search;
    const sex = req.query.sex;
    const anime = req.query.anime;
    const limit = req.query.limit;
    const page = req.query.page;
    if(search || anime || sex){
      const objectSearch = {};
      if (search) {
        objectSearch.name = { '$regex': search.toUpperCase() }
      }
      if (anime) {
        objectSearch.anime = anime.toUpperCase();
      }
      if (sex) {
        objectSearch.sex = sex.toUpperCase();
      }
      console.log(objectSearch);
      cm.getSearch(objectSearch, docs => res.send(docs));
    } else {
      cm.getAll( docs => res.send(docs), parseInt(limit), parseInt(page));
    }
  }

	getById(req, res) {
    const id = req.params.id;
    cm.getById(id, (docs) => {
      docs ? res.send(docs) : res.send({ message: 'Don\'t exist document' });
    });
    cm.addingClick(id);
  }
  
  getPhrasesByCharacter(req, res) {
    const id = req.params.id;
    cm.getPhrasesByCharacter(id, (docs) => {
      docs ? res.send(docs) : res.send({ message: 'Don\'t exist document' });
    });
  }

  getPhraseById(req, res) {
    const idCharacter = req.params.idCharacter;
    const idPhrase = req.params.idPhrase;
    cm.getPhraseById(idCharacter, idPhrase, (docs) => {
      docs ? res.send(docs) : res.send({ message: 'Don\'t exist document' });
    });
    cm.addingClick(idCharacter);
  }

  getPhraseAudio(req, res) {
    const idCharacter = req.params.idCharacter;
    const idPhrase = req.params.idPhrase;
    cm.getPhraseById(idCharacter, idPhrase, (audio) => {
      audio ? res.write(audio) : res.send({ message: 'Don\'t exist document' });
    }); 
    cm.addingClick(idCharacter);
  }

	save(req, res) {
    const name = req.body.name;
    const anime = req.body.anime;
    const sex = req.body.sex;
    const files = req.files;
    if (name && anime && sex && files) {
      const animeDirectory = anime.toUpperCase().replace(/ /g, '-');
      const img = files.img;
      img.name = format(img.name);
      const imgPath = `${directory}/img/${animeDirectory}/${img.name}`;
      const bodyKeys = Object.keys(req.body);
      const bodyValues = Object.values(req.body);
      const filesKeys = Object.keys(req.files);
      const filesValues = Object.values(req.files);
      const phrasesArr = getArrPhrasesPart(bodyKeys, bodyValues, 'phrase');
      const audiosArr = getArrPhrasesPart(filesKeys, filesValues, 'audio');

      existDirectory(`audio/${animeDirectory}`);
      existDirectory(`img/${animeDirectory}`, () => {
        img.mv(imgPath, (err) => {
          if (err) {
            deleteFile(imgPath, err);
            res.status(500).send({ msg: 'Error al guardar imagen' });
          }
          if (phrasesArr.length === audiosArr.length) {
            const phrases = [];
            addPhrases(phrases, phrasesArr, audiosArr, animeDirectory);
            ce.getColors(imgPath, (color) => {
              const character = {
                _id: null,
                clicks: (req.body.clicks || 0),
                name: req.body.name.toUpperCase(),
                anime: anime.toUpperCase(),
                sex: sex.toUpperCase(),
                imgRelUrl: imgPath.split(directory+'/')[1],
                popularColor: color.normal,
                contrastColor: color.contrast,
                phrases: phrases,
              };
              cm.saveCharacter(character, (msg) => res.send({ msg }), (msg) => {
                  deleteFile(`${directory}/${character.imgRelUrl}`);
                  character.phrases.map((phrase) => {
                    deleteFile(`${directory}/${phrase.audioRelUrl}`);
                  });
                  res.send({ msg})
                });
              });
          } else {
            deleteFile(imgPath, err);
            res.status(400).send({ message : 'No hay la misma cantidad de audios que de frases' });
          }
        });
      });
    } else {
      res.status(400).send({ message: "Error, falta llenar campos" });
    }
  }

  update(req, res) {
    const files = req.files;
    const _id = req.params.id;
    const name = req.body.name;
    const anime = req.body.anime;
    const sex = req.body.sex;
    const character = {};
    if (_id && name && anime && sex) {
      character._id = _id;
      character.name = name.toUpperCase();
      character.anime = anime.toUpperCase();
      character.sex = sex.toUpperCase();
      if (files) {
        const img = files.img;
        const animeDirectory = anime.toUpperCase().replace(/ /g, '-'); 
        const imgPath = `${directory}/img/${animeDirectory}/${format(img.name)}`;
        
        existDirectory(`img/${animeDirectory}`, () => {
          img.mv(imgPath, (err) => {
            if (err) {
              deleteFile(imgPath);
              res.status(500).send({ msg: 'Error al guardar imagen' });
            }
            ce.getColors(imgPath, (color) => {
              character.popularColor = color.normal;
              character.contrastColor = color.contrast;
              character.imgRelUrl = imgPath.split(`${directory}/`)[1];
              cm.getById(_id, (doc) => {
                character.clicks = doc.clicks;
                character.phrases = doc.phrases;
                deleteFile(`${directory}/${doc.imgRelUrl}`);
                cm.updateCharacter(character, msg => res.send({ msg }));
              });
            });
          });
        });
      } else {
        cm.getById(_id, (doc) => {
          character.clicks = doc.clicks;
          character.phrases = doc.phrases;
          character.popularColor = doc.popularColor;
          character.contrastColor = doc.contrastColor;
          character.imgRelUrl = doc.imgRelUrl;
          cm.updateCharacter(character, msg => res.send({ msg }));
        });
      }
    } else {
      res.status(400).send({ msg: 'Falta llenar campos' });
    }
  }

  addPhrases(req, res) {
    const _id = req.params.id;
    const files = req.files;
    if (_id && files) {
      const bodyKeys = Object.keys(req.body);
      const bodyValues = Object.values(req.body);
      const filesKeys = Object.keys(req.files);
      const filesValues = Object.values(req.files);
      const phrasesArr = getArrPhrasesPart(bodyKeys, bodyValues, 'phrase');
      const audiosArr = getArrPhrasesPart(filesKeys, filesValues, 'audio');
      cm.getById(_id, (docs) => {
        if (docs) {
          const animeDirectory = docs.anime.toUpperCase().replace(/ /g, '-');
          addPhrases(docs.phrases, phrasesArr, audiosArr, animeDirectory);
          cm.updateCharacter(docs, msg => res.send({ msg }));
        } else {
          res.status(204).send({ msg: 'Character not found' });
        }
      });
    } else {
     res.status(400).send({ msg: 'Error, falta el id' }); 
    }
  }

	delete(req, res) {
		const id = req.params.id;
		cm.delete(id, (doc, msg) => {
      deleteFile(`${directory}/${doc.imgRelUrl}`);
      doc.phrases.map((phrase) => {
        deleteFile(`${directory}/${phrase.audioRelUrl}`);
      });
      res.send({ message: msg })
    });
  }
  
  deletePhrase(req, res) {
    const id = req.params.id;
    const idPhrase = req.params.idPhrase;
    cm.deletePhrase(id, idPhrase, (audioPath, msg) => {
      deleteFile(`${directory}/${audioPath}`);
      res.send({ message: msg })
    });
  }
}

module.exports = CharacterController;
