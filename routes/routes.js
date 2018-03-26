const router = require('express').Router();
const character_route = require('./character-route');
const user_route = require('./user-route');

router
  .use('/characters', character_route)
  .use('/users', user_route);

module.exports = router;
