const mongoose = require('../database/db');

const Schema = { Schema: mongoose.Schema };

const UserSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    user: String,
    password: String,
  },
  {
    collection: 'users',
    versionKey: false,
  },
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
