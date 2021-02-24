// const { Emoji } = require('discord.js');
const mongoose = require('mongoose');


const shopSchema = new mongoose.Schema({
    name: { type: String, default: 'Shop' },
    guildID: { type: String, required: true, unique: true },
    items: [{
        name: String,
        price: Number,
    }],
});

module.exports = mongoose.model('shop', shopSchema);