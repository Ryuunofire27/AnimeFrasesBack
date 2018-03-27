const router = require('express').Router();
const character_route = require('./character-route');
const user_route = require('./user-route');
const files_route = require('./files-routes');

router
  .use('/characters', character_route)
  .use('/users', user_route)
  .use('/files', files_route);

module.exports = router;
