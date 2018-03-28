const mongoose = require('../database/db');
const autoIncrement = require('mongoose-auto-increment');

const Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

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

CharacterSchema.plugin(autoIncrement.plugin, { model: 'Character', field: 'id'});

const Character = mongoose.model('Character', CharacterSchema);

module.exports = Character;
