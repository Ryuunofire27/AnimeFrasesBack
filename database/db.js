const mongoose = require('mongoose');
const conf = require('./db-conf');

mongoose.connect(`mongodb:\/\/charlie:candy028@${conf.host}/${conf.db}`);

module.exports = mongoose;
