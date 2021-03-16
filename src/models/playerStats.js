const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    uuid: { required: true, type: String },
    stats: Array,
});

module.exports = mongoose.model('playerstat', playerSchema);