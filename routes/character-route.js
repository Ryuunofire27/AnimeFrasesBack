const router = require('express').Router();
const CharacterController = require('../controllers/character-controller');
const authentication = require('../middlewares/authentication').authentication;

const cc = new CharacterController();

router
  .get('/', cc.getAll)
  .get('/:id', cc.getById)
  .get('/:id/phrases', cc.getPhrasesByCharacter)
  .get('/:idCharacter/phrases/:idPhrase', cc.getPhraseById)
  .post('/', authentication, cc.save)
  .put('/:id', authentication, cc.update)
  .put('/:id/phrases', authentication, cc.addPhrases)
  .delete('/:id', authentication, cc.delete)
  .delete('/:id/phrases/:idPhrase', authentication, cc.deletePhrase);

module.exports = router;
