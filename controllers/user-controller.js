const UserModel = require('../models/user-model');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const seed = require('../config/token').seed;
const key = 'afErChCoWa';

const um = new UserModel();

class UserController {
  getAll(req, res) {
    um.getAll(docs => res.send(docs));
  }

  getById(req, res) {
    const id = req.params.id;
    um.getById(id, (docs) => {
      docs ? res.send(docs) : res.send({ message: 'Don\'t exist document' });
    });
  }

	save(req, res) {
    const user = req.body.user;
    const pssw = req.body.pssw;
    if (user && pssw) {
      const hmac = crypto.createHmac('sha256', key);
      hmac.update(pssw);
      const usuario = {
        _id: null,
        user,
        password: hmac.digest('hex'),
      };
      um.save(usuario, msg => res.send({ msg }));
    } else {
      res.status(400).send({ msg: 'falta llenar campos' });
    }
  }

	delete(req, res) {
    const id = req.params.id;
		id ? um.delete(id, msg => res.send({ message: msg })) : res.status(400).send({ msg: 'Falta el id' });
  }

  deletePhrase(req, res) {
    const id = req.params.id;
    const idPhrase = req.params.idPhrase;
    id && idPhrase ? um.deletePhrase(id, idPhrase, msg => res.send({ message: msg })) : res.status(400).send({ msg: 'Falta llenar campos' });
  }

  login(req, res) {
    const user = req.body.user;
    const pssw = req.body.pssw;
    if (user && pssw) {
      const hmac = crypto.createHmac('sha256', key);
      hmac.update(pssw);
      const usuario = {
        user,
        password: hmac.digest('hex'),
      };
      um.login(usuario, (msg, doc) => {
        if (doc) {
          const token = jwt.sign({ user: doc }, seed, { expiresIn: 3600 });
          res.send({ user: doc, token });
        } else {
          res.send({ msg });
        }
      });
    } else {
      res.status(400).send({ msg: 'Falta llenar campos' });
    }
  }
}

module.exports = UserController;
