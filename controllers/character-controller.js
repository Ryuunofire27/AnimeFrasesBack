const CharacterModel = require('../models/character-model');
const ColorExtract = require('../util/extract-color');
const util = require('../util/util');
const directory = require('../config/directory').directory;

const ce = new ColorExtract();
const cm = new CharacterModel();

class CharacterController {
  getAll(req, res) {
    const search = req.query.search;
    const sex = req.query.sex;
    const anime = req.query.anime;
    const limit = req.query.limit;
    const page = req.query.page;
    const pop = req.query.pop;
    const notVoid = req.query.void;
    const objectSearch = {};
    let wh = null;
    if (pop) {
      if(!(pop === 'asc' || pop === 'desc')) return res.status(400).send({ message: 'pop is not a defined statement'})
    }
    if (notVoid == 1) {
      wh = { phrases: { $gt: [] } };
    }
    if (search) {
      objectSearch.name = { '$regex': search.toUpperCase() }
    }
    if (anime) {
      objectSearch.anime = anime.toUpperCase();
    }
    if (sex) {
      objectSearch.sex = sex.toUpperCase();
    }
    cm.getAll( (err, docs) => {
      if (err) return res.send(404).send(err);
      return res.status(200).send(docs);
    },
     objectSearch, parseInt(limit), parseInt(page), pop, wh);
  }

	getById(req, res) {
    const id = req.params.id;
    cm.getById(id, (docs) => {
      docs ? res.status(200).send(docs) : res.status(404).send({ message: 'Don\'t exist document' });
    });
    cm.addingClick(id, (err) => {
      if (err) return res.send(500).send(err);
      return res.status(200).send({ message: 'Click aumentado correctamente'});
    });
  }
  
  getPhrasesByCharacter(req, res) {
    const id = req.params.id;
    cm.getPhrasesByCharacter(id, (docs) => {
      docs ? res.status(200).send(docs) : res.status(404).send({ message: 'Don\'t exist document' });
    });
  }

  getPhraseById(req, res) {
    const idCharacter = req.params.idCharacter;
    const idPhrase = req.params.idPhrase;
    cm.getPhraseById(idCharacter, idPhrase, (docs) => {
      docs ? res.send(docs) : res.status(404).send({ message: 'Don\'t exist document' });
    });
    cm.addingClick(idCharacter, (err) => {
      if (err) return res.send(500).send(err);
      return res.status(200).send({ message: 'Click aumentado correctamente'});
    });
  }

  getPhraseAudio(req, res) {
    const idCharacter = req.params.idCharacter;
    const idPhrase = req.params.idPhrase;
    cm.getPhraseById(idCharacter, idPhrase, (audio) => {
      audio ? res.write(audio) : res.status(404).send({ message: 'Don\'t exist document' });
    }); 
    cm.addingClick(idCharacter, (err) => {
      if (err) return res.send(500).send(err);
      return res.status(200).send({ message: 'Click aumentado correctamente'});
    });
  }

	save(req, res) {
    const name = req.body.name;
    const anime = req.body.anime;
    const sex = req.body.sex;
    const files = req.files;
    if (name && anime && sex && files) {
      const animeDirectory = anime.toUpperCase().replace(/ /g, '-');
      const img = files.img;
      img.name = util.format(img.name);
      const imgPath = `${directory}/img/${animeDirectory}/${img.name}`;
      const bodyKeys = Object.keys(req.body);
      const bodyValues = Object.values(req.body);
      const filesKeys = Object.keys(req.files);
      const filesValues = Object.values(req.files);
      const phrasesArr = util.getArrPhrasesPart(bodyKeys, bodyValues, 'phrase');
      const audiosArr = util.getArrPhrasesPart(filesKeys, filesValues, 'audio');

      util.existDirectory(`audio/${animeDirectory}`);
      util.existDirectory(`img/${animeDirectory}`, () => {
        img.mv(imgPath, (err) => {
          if (err) {
            util.deleteFile(imgPath, err);
            res.status(500).send({ msg: 'Error al guardar imagen' });
          }
          if (phrasesArr.length === audiosArr.length) {
            const phrases = [];
            util.addPhrases(phrases, phrasesArr, audiosArr, animeDirectory);
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
              cm.saveCharacter(character, (err, msg) => {
                  if (err) {
                    util.deleteFile(`${directory}/${character.imgRelUrl}`);
                    character.phrases.map((phrase) => {
                      util.deleteFile(`${directory}/${phrase.audioRelUrl}`);
                    });
                    return res.status(500).send(err);
                  }
                  res.send(msg);
                });
              });
          } else {
            util.deleteFile(imgPath, err);
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
        const imgPath = `${directory}/img/${animeDirectory}/${util.format(img.name)}`;
        
        util.existDirectory(`img/${animeDirectory}`, () => {
          img.mv(imgPath, (err) => {
            if (err) {
              util.deleteFile(imgPath);
              res.status(500).send({ msg: 'Error al guardar imagen' });
            }
            ce.getColors(imgPath, (color) => {
              character.popularColor = color.normal;
              character.contrastColor = color.contrast;
              character.imgRelUrl = imgPath.split(`${directory}/`)[1];
              cm.getById(_id, (doc) => {
                character.clicks = doc.clicks;
                character.phrases = doc.phrases;
                util.deleteFile(`${directory}/${doc.imgRelUrl}`);
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
      const phrasesArr = util.getArrPhrasesPart(bodyKeys, bodyValues, 'phrase');
      const audiosArr = util.getArrPhrasesPart(filesKeys, filesValues, 'audio');
      cm.getById(_id, (docs) => {
        if (docs) {
          const animeDirectory = docs.anime.toUpperCase().replace(/ /g, '-');
          util.addPhrases(docs.phrases, phrasesArr, audiosArr, animeDirectory);
          cm.updateCharacter(docs, msg => res.send({ msg }));
        } else {
          res.status(204).send({ msg: 'Character not found' });
        }
      });
    } else {
     res.status(400).send({ msg: 'Error, falta el id' }); 
    }
  }

  updatePhrase(req, res){
    const idCharacter = req.params.idCharacter;
    const idPhrase = req.params.idPhrase;
    if (idCharacter && idPhrase) {
      const phrase = req.body.phrase;
      const files = req.files;
      if (phrase || files) {
        cm.getById(idCharacter, (doc) => {
          const animeDirectory = doc.anime.toUpperCase().replace(/ /g, '-');
          doc.phrases = doc.phrases.map((p) => {
            if (p._id == idPhrase) {
              if (files) {
                const audio = req.files.audio;
                const audioArr = [audio];
                const phrasesArr = phrase ? [phrase] : [p.phrase];
                const phrasesAdd = [];
                util.addPhrases(phrasesAdd, phrasesArr, audioArr, animeDirectory);
                util.deleteFile(`${directory}/${p.audioRelUrl}`);
                p.phrase = phrasesAdd[0].phrase;
                p.audioRelUrl = phrasesAdd[0].audioRelUrl;
              } else {
                p.phrase = phrase;
              }
            }
            return p;
          });
          cm.updateCharacter(doc, msg => res.send({ msg }));
        });
      } else {
        res.status(400).send({ msg: 'falta llenar campos'});
      }
    } else {
      res.status(400).send({ msg: 'Error, falta los ids'});
    }
  }

	delete(req, res) {
    const id = req.params.id;
    if (id) {
      cm.delete(id, (doc, msg) => {
        util.deleteFile(`${directory}/${doc.imgRelUrl}`);
        doc.phrases.map((phrase) => {
          util.deleteFile(`${directory}/${phrase.audioRelUrl}`);
        });
        res.send({ msg });
      });
    } else {
      res.status(400).send({ msg: 'Error, falta el id' });
    }
  }
  
  deletePhrase(req, res) {
    const id = req.params.id;
    const idPhrase = req.params.idPhrase;
    if(id && idPhrase) {
      cm.deletePhrase(id, idPhrase, (msg, audioPath) => {
        if (audioPath) util.deleteFile(`${directory}/${audioPath}`);
        res.send({ message: msg })
      });
    } else {
      res.status(400).send({ msg: 'Error, falta los ids' });
    }
  }

  addingClick(req, res){
    const id = req.params.id;
    if (id) {
      cm.addingClick(id, (err) => {
        if (err) return res.send(500).send(err);
        return res.status(200).send({ message: 'Click aumentado correctamente'});
      });
    } else {
      return res.status(400).send({ message: 'Error, falta el id de la frase' });
    }
  }
}

module.exports = CharacterController;
