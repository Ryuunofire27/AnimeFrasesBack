const router = require('express').Router();
const characterRoute = require('./character-route');
const userRoute = require('./user-route');
const filesRoute = require('./files-routes');

router
  .use('/characters', characterRoute)
  .use('/users', userRoute)
  .use('/files', filesRoute);

module.exports = router;
