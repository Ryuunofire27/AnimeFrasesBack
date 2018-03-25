const mongoose = require('../database/db');

const Schema = mongoose.Schema;

const PhrasesSchema = new Schema({
  _id : Schema.Types.ObjectId,
  idCharacter: String,
  phrase: String,
  audioRelUrl : String,
},
{
  collection : 'phrases',
  versionKey : false
});

const Phrases = mongoose.model('Phrase', PhrasesSchema);

module.exports = Phrases;