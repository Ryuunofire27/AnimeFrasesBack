const mongoose = require('../database/db');

const Schema = mongoose.Schema;

const CounterCharacterSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, required: true },
    seq: { type: Number, default: 0 }
  },
  {
    collection: 'counters',
    versionKey: false,
  },
);

const CounterCharacter = mongoose.model('CounterCharacter', CounterCharacterSchema);

module.exports = CounterCharacter;