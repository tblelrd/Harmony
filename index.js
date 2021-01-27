const Discord = require('discord.js');
const path = require('path');
const config = require('./config.json');
const fs = require('fs');
const DisTube = require('distube');

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

    const baseFile = 'command-base.js';
    const commandBase = require(`./commands/${baseFile}`);

    const readCommands = dir => {
        const files = fs.readdirSync(path.join(__dirname, dir));
        for (const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file));
            if (stat.isDirectory()) {
                readCommands(path.join(dir, file));
            } else if (file !== baseFile) {
                const option = require(path.join(__dirname, dir, file));
                commandBase(bot, option);
            }
        }
    };


    readCommands('commands');
    console.log(`Logged in as ${bot.user.username}!`);

		console.log(process.env.TOKEN)
});

// Queue status template
const status = (queue) => `Loop: \`${queue.repeatMode ? queue.repeatMode == 2 ? 'Queue' : 'Song' : 'Off'}\` |  Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``;

// DisTube event listeners, more in the documentation page
bot.distube
    .on('error', (message, err) => {
        message.channel.send('There was an error lmao');
        console.log(err);
    })
    .on('playSong', (message, queue, song) => {

        bot.currentSong = message.channel.send(
            `Playing \`${song.name}\` - \`${song.formattedDuration}\`\nAdded by: ${song.user.username}\n${status(queue)}`,
        );
    })
    .on('addSong', (message, queue, song) => message.channel.send(
        `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user.username}`,
    ))
    .on('playList', (message, queue, playlist, song) => message.channel.send(
        `Play \`${playlist.name}\` playlist (${playlist.songs.length} songs).\nRequested by: \`${song.user.username}\`\nNow playing \`${song.name}\` - \`${song.formattedDuration}\`\n${status(queue)}`,
    ))
    .on('addList', (message, queue, playlist) => message.channel.send(
        `Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to queue\n${status(queue)}`,
    ))
    // DisTubeOptions.searchSongs = true
    .on('searchResult', (message, result) => {
        let i = 0;
        message.channel.send(`\`\`\`nim\nChoose an option from below\n\n${result.map(song => `${++i}. ${song.name} - ${song.formattedDuration}`).join('\n')}\n\nEnter anything else or wait 60 seconds to cancel\`\`\``);
    })
    // DisTubeOptions.searchSongs = true
    .on('searchCancel', (message) => message.channel.send('Searching `canceled`'))
    .on('error', (message, e) => {
        console.error(e);
        message.channel.send('An error encountered: ' + e);
    });

const Database = require("@replit/database")
const db = new Database()

db.get("token").then(value => {
	bot.login(value);
});	

let connectedAmount = 0;
const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end(connectedAmount.toString());
});

server.on('connection', socket => {
	connectedAmount++;
});
server.listen(3000);
