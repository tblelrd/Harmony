const Discord = require('discord.js');
const DisTube = require('distube');
const config = require('./config.json');
const registery = require('./src/utils/register');

const bot = new Discord.Client();

bot.currentSong = null;
bot.distube = new DisTube(bot, { searchSongs: true, emitNewSongOnly: true });

bot.once('ready', async () =>{

    bot.user.setPresence({
        activity: {
            name: `${config.prefix}help`,
        },
        status: 'dnd',
    })
    .catch(console.error);

    registery.registerCommands(bot, 'commands');
    registery.registerEvents(bot, 'events');


    console.log(`Logged in as ${bot.user.username}!`);

    bot.startDate = Date.now();
});

const Database = require('@replit/database');
const db = new Database();
db.get('token').then(value => {
	bot.login(value);
});