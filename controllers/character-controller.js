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
  if(!keys || !values || !part) throw new Error('Send all parameters');
  let j = 0;
  const arr = [];
  
  for(let i = 0; i < keys.length; i++){
    if(keys[i] === `${part}_${j}`){
      arr.push(values[i]);
      j++;
    }
  }
  return arr;
};

const deleteFile = (filePath, err1) => {
  fs.stat(filePath, (err) => {
    if(!err){
      fs.unlink(filePath, (err) => {
        if(!err) console.log('eliminado con exito');
      });
    }
  });
};

const existDirectory = (fileDirectory, cb) => {
  fs.readdir(`${directory}/${fileDirectory}`, (err) => {
    if(err) {
      fs.mkdirSync(`${directory}/${fileDirectory}`);
    }
    if(cb){
      cb();
    }
  });
}

const addPhrases = (phrases, phrasesArr, audiosArr, animeDirectory) => {
  for(let i = 0; i < phrasesArr.length; i++){
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

class CharacterController{

	getAll(req,res,next){
    const search = req.query.search;
    const sex = req.query.sex;
    const anime = req.query.anime;
    const limit = req.query.limit;
    const page = req.query.page;
    if(search){
      const objectSearch = {
        name: search,
      }
      if(sex || anime){
        objectSearch.description = {
          $in : []
        };
      }
      if(anime){
        objectSearch.description.$in.push(anime.toUpperCase());
      }
      if(sex){
        objectSearch.description.$in.push(sex.toUpperCase());
      }
      cm.getSearch(objectSearch, docs => res.send(docs));
    }else{
      cm.getAll(parseInt(limit), parseInt(page), (docs)=>{
        res.send(docs);
      });
    }
  }

	getById(req,res,next){
    const id = req.params.id;
    cm.getById(id, (docs) => {
      docs ? res.send(docs) : res.send({message: 'Don\'t exist document'});
    });
  }
  
  getPhrasesByCharacter(req, res, next){
    const id = req.params.id;
    cm.getPhrasesByCharacter(id, docs => {
      docs ? res.send(docs) : res.send({message: 'Don\'t exist document'});
    });
  }

  getPhraseById(req, res, next){
    const idCharacter = req.params.idCharacter;
    const idPhrase = req.params.idPhrase;
    cm.getPhraseById(idCharacter, idPhrase, docs => {
      docs ? res.send(docs) : res.send({message: 'Don\'t exist document'});
    });
    cm.addingClick(idCharacter);
  }

  getPhraseAudio(req, res, next){
    const idCharacter = req.params.idCharacter;
    const idPhrase = req.params.idPhrase;
    cm.getPhraseById(idCharacter, idPhrase, audio => {
      audio ? res.write(audio) : res.send({message: 'Don\'t exist document'});
    }); 
    cm.addingClick(idCharacter);
  }

	save(req,res,next){
    const name = req.body.name;
    const anime = req.body.anime;
    const sex = req.body.sex;
    const files = req.files;
    if(name && anime && sex && files){
      const animeDirectory = anime.toUpperCase().replace(/ /g, '-');
      const img = files.img;
      const imgPath = `${directory}/img/${animeDirectory}/${format(img.name)}`;
      const bodyKeys = Object.keys(req.body);
      const bodyValues = Object.values(req.body);
      const filesKeys = Object.keys(req.files);
      const filesValues = Object.values(req.files);
      const phrasesArr = getArrPhrasesPart(bodyKeys, bodyValues, 'phrase');
      const audiosArr = getArrPhrasesPart(filesKeys, filesValues, 'audio');

      existDirectory(`audio/${animeDirectory}`);
      existDirectory(`img/${animeDirectory}`, () => {
        img.mv(imgPath, (err) => {
          if(err) deleteFile(imgPath, err);
          if(phrasesArr.length === audiosArr.length){
            const phrases = [];
            addPhrases(phrases, phrasesArr, audiosArr, animeDirectory);
            ce.getColors(imgPath, (color) => {
              const character = {
                _id: null,
                clicks: (req.body.clicks || 0),
                name : req.body.name.toUpperCase(),
                anime: anime.toUpperCase(),
                sex: sex.toUpperCase(),
                imgRelUrl : imgPath.split(directory+'/')[1],
                popularColor : color.normal,
                contrastColor : color.contrast,
                phrases : phrases
              };
              cm.saveCharacter(character, (msg) => res.send({message: msg}), (msg) => {
                  deleteFile(`${directory}/${character.imgRelUrl}`);
                  character.phrases.map((phrase) => {
                    deleteFile(`${directory}/${phrase.audioRelUrl}`);
                  });
                  res.send({message: msg})
                });
              });
          }else{
            deleteFile(imgPath, err);
            res.send({message : 'No hay la misma cantidad de audios que de frases'});
          }
        });
      });
    }else{
      res.send({message: "Error, falta llenar campos"});
    }
  }

  addPhrases(req, res, next){
    const _id = req.params.id;
    if(_id){
      const bodyKeys = Object.keys(req.body);
      const bodyValues = Object.values(req.body);
      const filesKeys = Object.keys(req.files);
      const filesValues = Object.values(req.files);
      const phrasesArr = getArrPhrasesPart(bodyKeys, bodyValues, 'phrase');
      const audiosArr = getArrPhrasesPart(filesKeys, filesValues, 'audio');
      cm.getById(_id, (docs) => {
        const animeDirectory = docs.anime.toUpperCase().replace(/ /g, '-');
        addPhrases(docs.phrases, phrasesArr, audiosArr, animeDirectory);
        cm.updateCharacter(docs, msg => res.send(msg));
      });
    }else{
     res.send('Error, falta el id'); 
    }
  }

	delete(req,res,next){
		const id = req.params.id;
		cm.delete(id, (msg) => res.send({message: msg}));
  }
  
  deletePhrase(req, res, next){
    const id = req.params.id;
    const idPhrase = req.params.idPhrase;
    cm.deletePhrase(id, idPhrase, (msg) => res.send({message: msg}));
  }
}

module.exports = CharacterController;