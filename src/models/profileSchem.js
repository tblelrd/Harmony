const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userID: { type: String, require: true, unique: true },
    guildID: { type: String, require: true },
    coins: { type: Number, default: 1000 },
    bank: { type: Number },
    inventory: { type: Array },
});

const model = mongoose.model('profile', profileSchema);

module.exports = model;