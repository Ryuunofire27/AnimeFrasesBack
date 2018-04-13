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
  .post('/:id/phrases', authentication, cc.addPhrases)
  .put('/:id', authentication, cc.update)
  .put('/:idCharacter/phrases/:idPhrase', authentication, cc.updatePhrase)
  .put('/:id/click', cc.addingClick)
  .delete('/:id', authentication, cc.delete)
  .delete('/:id/phrases/:idPhrase', authentication, cc.deletePhrase);

module.exports = router;
