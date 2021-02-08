const mongoose = require('mongoose');

const playlist = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    songs: [],
    userID: String,
    name: String,
});

module.exports = mongoose.model('playlist', playlist);