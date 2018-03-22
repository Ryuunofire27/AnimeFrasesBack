const mongoose = require('../database/db');

const Schema = mongoose.Schema;

//way 1
const CharacterSchema = new Schema({
  _id : Schema.Types.ObjectId,
  name : String,
  clicks: Number,
  description: Array,
  popularColor : String,
  contrastColor: String,
  imgRelUrl : String,
  phrases : [{
      id : Schema.Types.ObjectId,
      phrase: String,
      audioRelUrl : String,
    }]
},
{
  collection : 'characters',
  versionKey : false
});

//way 2
/*
const CharacterSchema = new Schema({
  _id : Schema.Types.ObjectId,
  name : String,
  clicks: int,
  popularColor : String,
  contrastColor: String,
  imgRelUrl : String,
  phrases : [{
      id_phrase : int,
      phrase: String,
      audioRelUrl : String,
    }]
},
{
  collection : 'characters',
  versionKey : false
});

const PhrasesSchema = new Schema({
  _id : Schema.Types.ObjectId,
  id_character : String
  phrase: String,
  audioRelUrl : String
},
{
  collection : 'phrases',
  versionKey : false
});
*/

const Character = mongoose.model('Character', CharacterSchema);

module.exports = Character;
