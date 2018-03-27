const mongoose = require('../database/db');

const Schema = mongoose.Schema;

const CharacterSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    name: String,
    clicks: Number,
    description: String,
    sex: String,
    anime: String,
    popularColor: String,
    contrastColor: String,
    imgRelUrl: String,
    phrases: [{
      id: Schema.Types.ObjectId,
      phrase: String,
      audioRelUrl: String,
    }],
  },
  {
    collection: 'characters',
    versionKey: false,
  },
);

const Character = mongoose.model('Character', CharacterSchema);

module.exports = Character;
