const CharacterModel = require('../models/character-model');

const cm = new CharacterModel();

class CharacterController{

	getAll(req,res,next){
		cm.getAll((docs)=>{
      console.log(cm);
      res.send(docs);
		});
	}

	getById(req,res,next){
		const id = req.params.id;
		cm.getById(id, docs => {
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

	save(req,res,next){
    const character = {
      _id: (req.body.id || null),
      clicks: (req.body.clicks || 0),
      name : req.body.name,
      anime: req.body.anime,
      sex: req.body.sex,
      img : req.body.img,
      phrases : req.body.phrases
    };
		console.log(character);

		cm.saveCharacter(character, () => res.send({message: 'Insert/Update succesfully'}));
	}

	delete(req,res,next){
		const id = req.params.id;
		cm.delete(id, () => res.send({message: 'Delete succesfully'}));
  }
  
  deletePhrase(req, res, next){
    const id = req.params.id;
    const idPhrase = req.params.idPhrase;
    cm.deletePhrase(id, idPhrase, () => res.send({message: 'Delete phrase succesfully'}))
  }
}

module.exports = CharacterController;