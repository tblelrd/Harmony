/*
TODO:
  -No spam ✔
  -Better import playlist (if possible) ✔
*/
// My id 500648375297900545

const Discord = require('discord.js');
// const DisTube = require('distube');
const mongoose = require('mongoose');

const config = require('./config.json');
const registery = require('./src/utils/register');

const bot = new Discord.Client();

bot.currentSong = null;
// bot.distube = new DisTube(bot, { searchSongs: true, emitNewSongOnly: true });

bot.once('ready', async () =>{

    bot.user.setPresence({
        activity: {
            name: `${config.prefix}help`,
        },
        status: 'dnd',
    })
    .catch(console.error);

    mongoose.connect('mongodb+srv://televox:getjacked@jackack-bot.r14ha.mongodb.net/harmony', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
    registery.registerCommands(bot);
    registery.registerEvents(bot);
    registery.registerDm(bot);


    console.log(`Logged in as ${bot.user.username}!`);

    bot.startDate = Date.now();
});
bot.setMaxListeners(0);
const Database = require('@replit/database');
const db = new Database();
db.get('token').then(value => {
	bot.login(value);
});
// bot.on('message', msg => {
//     msg.member.roles.highest.position
// });