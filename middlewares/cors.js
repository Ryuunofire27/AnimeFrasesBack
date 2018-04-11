const cors = require('cors');

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 204,
  allowedHeaders: 'Content-Type, Authorization, Accept, Accept-Language, Content-Language',
  preflightContinue: false,
  method: 'GET, HEAD, PUT, POST, DELETE',

}

module.exports = cors;