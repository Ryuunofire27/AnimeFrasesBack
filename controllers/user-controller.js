const UserModel = require('../models/user-model');
const crypto = require('crypto');

const um = new UserModel();

class CharacterController{

	getAll(req,res,next){
    um.getAll( docs => res.send(docs));
  }

	getById(req,res,next){
    const id = req.params.id;
    cm.getById(id, (docs) => {
      docs ? res.send(docs) : res.send({message: 'Don\'t exist document'});
    });
  }
	save(req,res,next){
    const user = req.body.user;
    const pssw = req.body.pssw;
    if(user || pssw){
      const hmac = crypto.createHmac('sha256', 'afErChCoWa');
      hmac.update(pssw);
      const usuario = {
        _id : null,
        user,
        password : hmac.digest('hex')
      }
      um.save(usuario, msg => res.send({msg}));
    }
  }
  
  update(req, res, next){
    /*const user = req.body.user;
    const pssw = req.body.pssw;
    const _id = req.body.id;
    if(user || pssw){
      hmac.update(pssw);
      const usuario = {
        _id,
        user,
        password : hmac.digest('hex')
      }
      um.save(usuario, msg => res.send({msg}));
    }*/
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

  login(req, res, next){
    const user = req.body.user;
    const pssw = req.body.pssw;
    if(user || pssw){
      const hmac = crypto.createHmac('sha256', 'afErChCoWa');
      hmac.update(pssw);
      const usuario = {
        user,
        password : hmac.digest('hex')
      }
      um.login(usuario, msg => res.send({msg}));
    }
  }
}

module.exports = CharacterController;