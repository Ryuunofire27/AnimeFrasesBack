const router = require('express').Router();
const FilesController = require('../controllers/files-controller');

const fc = new FilesController();

router
  .get('/:type/:anime/:file', fc.getFile);

module.exports = router;