const jwt = require('jsonwebtoken');
const seed = require('../config/token').seed;

exports.authentication = (req, res, next) => {
  const token = req.headers.authorization;
  jwt.verify(token, seed, (err) => {
    if (err) {
      return res.status(401).send({
        msg: 'Token incorrecto',
        err,
      });
    }
    next();
  });
};
