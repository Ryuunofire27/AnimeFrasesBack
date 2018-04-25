const mongoose = require('../database/db');

const Schema = mongoose.Schema;

const DateConnectionsSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    date: { type: Date, default: Date.now },
    connections: { type: Number, default: 0 }
  },
  {
    collection: 'date_connections',
    versionKey: false,
  },
);

const DateConnections = mongoose.model('DateConnections', DateConnectionsSchema);

module.exports = DateConnections;