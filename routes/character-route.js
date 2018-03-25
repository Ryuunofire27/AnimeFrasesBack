const router = require('express').Router();
const CharacterController = require('../controllers/character-controller');

const cc = new CharacterController();

router
  .get('/', cc.getAll)
  .get('/:id', cc.getById)
  .get('/:id/phrases', cc.getPhrasesByCharacter)
  .get('/:idCharacter/phrases/:idPhrase', cc.getPhraseById)
  .get('/')
  .post('/', cc.save)
  .put('/:id', cc.save)
  .delete('/:id', cc.delete)
  .delete('/:id/phrases/:idPhrase', cc.deletePhrase);

module.exports = router;