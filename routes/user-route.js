const router = require('express').Router();
const UserController = require('../controllers/user-controller');

const uc = new UserController();

router
  .get('/', uc.getAll)
  .get('/:id', uc.getById)
  .post('/', uc.save)
  .post('/login', uc.login)
  .delete('/:id', uc.delete)

module.exports = router;  