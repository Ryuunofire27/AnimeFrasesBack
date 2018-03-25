const CharacterModel = require('../models/character-model');
const fs = require('fs');
const ColorExtract = require('../util/extract-color');

const directory = '/var/animefrases';
const ce = new ColorExtract();
const cm = new CharacterModel();

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
    if(err) fs.mkdir(`${directory}/${fileDirectory}`, (err) => {
      if(err) cb(err);
    });
  });
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
      const imgPath = `${directory}/img/${animeDirectory}/${img.name}`;
      const bodyKeys = Object.keys(req.body);
      const bodyValues = Object.values(req.body);
      const filesKeys = Object.keys(req.files);
      const filesValues = Object.values(req.files);
      const phrasesArr = getArrPhrasesPart(bodyKeys, bodyValues, 'phrase');
      const audiosArr = getArrPhrasesPart(filesKeys, filesValues, 'audio');

      existDirectory(`img/${animeDirectory}`, err => res.send(err));
      existDirectory(`audio/${animeDirectory}`, err => res.send(err));

      img.mv(imgPath, (err) => {
        if(err) deleteFile(imgPath, err);
        if(phrasesArr.length === audiosArr.length){
          const phrases = [];
          for(let i = 0; i < phrasesArr.length; i++){
            const audioPath = `${directory}/audio/${animeDirectory}/${audiosArr[i].name}`
            audiosArr[i].mv(audioPath, (err) => {
              if(err) deleteFile(audioPath, err);
            });
            phrases.push({
              phrase: phrasesArr[i],
              audioRelUrl: audioPath.split(directory+'/')[1]
            });
          }
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
            console.log(character);
            cm.saveCharacter(character, (msg) => res.send({message: msg}), (msg) => {
                deleteFile(`${directory}/${character.imgRelUrl}`);
                character.phrases.map((phrase) => {
                  console.log(`${directory}/${phrase.audioRelUrl}`);
                  deleteFile(`${directory}/${phrase.audioRelUrl}`);
                });
                res.send({message: msg})
              });
            });
        }else{
          deleteFile(imgPath, err);
          res.status(500);
          res.send({message : 'No hay la misma cantidad de audios que de frases'});
        }
      });
    }else{
      res.send({message: "Error, falta llenar campos"});
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