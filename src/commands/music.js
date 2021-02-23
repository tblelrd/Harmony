/* eslint-disable no-unused-vars */
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const mongoose = require('mongoose');

const { ytKey } = require('../../config.json');
const { YTSearcher } = require('ytsearcher');
const playlistSchema = require('../models/playlistModel');

const queue = new Map();
const searcher = new YTSearcher({
    key: ytKey,
    revealed: true,
});

module.exports = {
    commands: ['music', 'm'],
    expectedArgs: '<command> [<other>]',
    minArgs: 1,
    callback: (msg, args, text, bot) => {
        const { member, guild, author } = msg;

        const serverQueue = queue.get(guild.id);
        const now = Date.now();

        const command = args[0];

        switch(command) {
            case 'play':
            case 'p':
                if(!args[1]) return msg.channel.send('nu uh u havent given me the song name');
                execute(msg, serverQueue, args);
            break;

            case 'stop':
            case 'dc':
            case 'disconnect':
                stop(msg, serverQueue);
            break;

            case 'skip':
            case 's':
                skip(msg, serverQueue, bot);
            break;

            case 'pause':
                pause(msg, serverQueue);
            break;

            case 'resume':
                resume(msg, serverQueue);
            break;

            case 'queue':
            case 'q':
                displayQ(msg, serverQueue);
            break;

            case 'loop':
            case 'l':
                loopQ(msg, serverQueue);
            break;

            case 'rr':
            case 'remove':
                if(!args[1]) return msg.reply('Nuh uh');
                const number = parseInt(args[1]);
                if(!number) return msg.channel.send('Aint a number bro');
                remove(msg, serverQueue, number);
            break;

            case 'ping':
                msg.channel.send(`🏓Latency is \`${now - msg.createdTimestamp}ms\`. \nAPI Latency is \`${Math.round(bot.ws.ping)}ms\``);
            break;

            case 'saveplaylist':
            case 'spl':
                if(args[2]) return msg.channel.send('Only one word names please');
                const name = args[1] ? args[1] : 'playlist';
                savePlaylist(msg, serverQueue, name);
            break;

            case 'getplaylists':
            case 'gpl':
                getPlaylists(msg);
            break;

            case 'deleteplaylist':
            case 'dpl':
                if(!args[1]) return msg.channel.send('Name of playlist???? loser');
                deletePlaylist(msg, args[1]);
            break;

            case 'loadplaylist':
            case 'lpl':
                loadPlaylist(msg, serverQueue, args[1]);
            break;

            case 'shuffle':
            case 'sh':
                shuffleQ(msg, serverQueue);
            break;

            case 'h':
            case 'help':
                const h = new Discord.MessageEmbed()
                .setTitle('Help')
                .setThumbnail(bot.user.avatarURL())
                .setColor('#000000')
                .addField('Main', '`play` `stop` `pause` `resume` `help`')
                .addField('Queue', '`queue` `skip` `loop` `shuffle` `remove`')
                .addField('Playlist', '`saveplaylist` `loadplaylist` `getplaylist`')
                .setFooter('Made by Jackack');

                msg.channel.send(h);
            break;
        }
    },
};

//
const STMSS = (s) => {
    const min = s % 60;
    let left = ((s - min) / 60);
    if(left >= 60) left = MTHMM(left);
    const right = (min > 9 ? min == 0 ? ':0' : ':' : ':0') + min;
    return(left + right);
};
const MTHMM = (m) => {
    const hour = m % 60;
    const left = ((m - hour) / 60);
    const right = (hour > 9 ? hour == 0 ? ':0' : ':' : ':0') + hour;
    return(left + right);
};
async function execute(msg, serverQueue, args) {
    args.shift();
    const search = args.join(' ');
    const vc = msg.member.voice.channel;
    if(!vc) return msg.reply('You aint in a vc');

    const result = await searcher.search(search, { type: 'video' });
    const songInfo = await ytdl.getInfo(result.first.url);

    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
        vLength: songInfo.videoDetails.lengthSeconds != 0 ? STMSS(songInfo.videoDetails.lengthSeconds) : 'LIVE',
    };

    if(!serverQueue) {
        const queueConstructor = {
            tChannel: msg.channel,
            vChannel: vc,
            nowPlayng: null,
            connection: null,
            songs: [],
            volume: 10,
            playing: true,
            loop: false,
        };
        queue.set(msg.guild.id, queueConstructor);

        queueConstructor.songs.push(song);

        try {
            const connection = await vc.join();
            queueConstructor.connection = connection;
            play(msg.guild, queueConstructor.songs[0]);
            msg.react('👍');
        } catch (error) {
            console.error(error);
            msg.react('👎');
            queue.delete(msg.guild.id);
            return msg.channel.send('Unable to join vc :(');
        }
    } else {
        serverQueue.songs.push(song);
        return msg.channel.send(`Added \`${song.title}\` to the \`queue\``);
    }
}
async function play (guild, song) {
    const serverQueue = queue.get(guild.id);
    if(!song) {
        serverQueue.vChannel.leave();
        serverQueue.tChannel.send('i leve :(');
        return queue.delete(guild.id);
    }
    if(serverQueue.nowPlaying) serverQueue.nowPlaying.delete();
    serverQueue.nowPlaying = await serverQueue.tChannel.send(serverQueue.songs[0] ? `Now playing \`${serverQueue.songs[0].title}\`` : 'No more songs in queue :(');
    const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on('finish', () => {
        if(serverQueue.loop) {
            serverQueue.songs.push(serverQueue.songs[0]);
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        } else {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        }
    });
}
function stop (msg, serverQueue) {
    if(!serverQueue) return msg.channel.send('U havent event played a song yet dumbass');
    serverQueue.songs = [];
    try {
        serverQueue.connection.dispatcher.end();
        msg.react('👍');
    } catch (err) {
        console.error(err);
        queue.delete(msg.guild.id);
        msg.react('👎');
        msg.reply('there was error');
        serverQueue.connection.disconnect();
    }
}
function skip (msg, serverQueue, bot) {
    if(!serverQueue) return msg.channel.send('U havent event played a song yet dumbass');
    if (!msg.member.voice.channel) return msg.channel.send('you aint in a vc ;-;');
    if(!serverQueue) return msg.channel.send('nothing to skip lmao');
    try {
        serverQueue.connection.dispatcher.end();
        msg.react('👍');
    } catch (err) {
        console.error(err);
        queue.delete(msg.guild.id);
        msg.react('👎');
        msg.reply('there was error');
        serverQueue.connection.disconnect();
    }
}
function pause (msg, serverQueue) {
    if(!serverQueue) return msg.channel.send('U havent event played a song yet dumbass');
    if(!serverQueue.connection) return msg.channel.send('no music playin');
    if(!msg.member.voice.channel) return msg.channel.send('You aint in a vc ;-;');
    if(serverQueue.connection.dispatcher.paused) return msg.channel.send('Bot already paused baaaaaka');

    serverQueue.connection.dispatcher.pause();
    msg.react('👍');
    msg.channel.send('Song has been `paused`');
}
function resume (msg, serverQueue) {
    if(!serverQueue) return msg.channel.send('U havent event played a song yet dumbass');
    if(!serverQueue.connection) return msg.channel.send('no music playin');
    if(!msg.member.voice.channel) return msg.channel.send('You aint in a vc ;-;');
    if(serverQueue.connection.dispatcher.resumed) return msg.channel.send('Bot already playing baaaaaka');

    serverQueue.connection.dispatcher.resume();
    msg.react('👍');
    msg.channel.send('Song has been `resumed`');
}
function displayQ (msg, serverQueue) {
    if(!serverQueue) return msg.channel.send('U havent event played a song yet dumbass');
    if(!serverQueue.connection) return msg.channel.send('no music playin');
    const list = serverQueue.songs.map((song, id) =>
        `${id + 1}. ${song.title} - ${song.vLength}`,
    ).join('\n');
    msg.react('👍');
    msg.channel.send('```nim\n---Song Queue---\n\n' + list + `\n\n${serverQueue.loop ? 'Looping Queue' : 'Loop off'}` + '```');
}
function loopQ (msg, serverQueue) {
    if(!serverQueue) return msg.channel.send('U havent event played a song yet dumbass');
    if(!serverQueue.connection) return msg.channel.send('no music playin');
    if(!msg.member.voice.channel) return msg.channel.send('You aint in a vc ;-;');

    serverQueue.loop = !serverQueue.loop;

    msg.react('👍');
    return msg.channel.send(`Toggled loop to \`${serverQueue.loop ? 'Queue' : 'Off'}\``);
}
function remove (msg, serverQueue, id) {
    if(!serverQueue) return msg.channel.send('U havent event played a song yet dumbass');
    if(!serverQueue.connection) return msg.channel.send('no music playin');
    if(!msg.member.voice.channel) return msg.channel.send('You aint in a vc ;-;');
    if(!serverQueue.songs[id - 1]) return msg.channel.send('Song doesnt exist loser');

    msg.react('👍');
    msg.channel.send(`Removed song: \`${serverQueue.songs[id - 1].title}\``);
    serverQueue.songs.splice(id - 1, 1);
    if(id - 1 == 0) {
        play(msg.guild, serverQueue.songs[0]);
    }
}
function savePlaylist (msg, serverQueue, name) {
    if(!serverQueue) return msg.channel.send('U havent event played a song yet dumbass');
    if(!msg.member.voice.channel) return msg.channel.send('U ain in a vc ;-;');
    if(!serverQueue.connection || !serverQueue.songs) return msg.channel.send('Nothing to save .-.');

    const playlist = new playlistSchema({
        _id: mongoose.Types.ObjectId(),
        songs: serverQueue.songs,
        userID: msg.author.id,
        name: name,
    });

    playlistSchema.findOneAndDelete({ name: playlist.name }, (err, list) => {
        if(!list) return;
        msg.reply(`Updated playlist: \`${name}\``);
    });

    msg.react('👍');
    playlist.save()
    .then((res) => {
        console.log(`${res.userID} saved a playlist!`);
        msg.channel.send(`Playlist, \`${res.name}\`, has been saved!`);
    })
    .catch(console.error);
}
function getPlaylists (msg) {
    msg.react('👍');
    playlistSchema.find({ userID: msg.author.id }, (err, playlists) => {
        if(!playlists[0]) return msg.channel.send('You dont have any saved playlists!');
        // if(typeof playlists == 'string') {
        //     playlists = [playlists];
        // }
        const list = playlists.map((playlist, id) => `${id + 1}. ${playlist.name}`).join('\n');

        msg.channel.send('```nim\n---Your Playlists---\n\n' + list + '```');
    });
}
function deletePlaylist(msg, name) {
    msg.react('👍');
    playlistSchema.findOneAndDelete({ name: name, userID: msg.author.id }, (err, playlist) => {
        if(!playlist) return msg.reply('doesnt exist baaaaka');
        msg.channel.send('Succesfully deleted playlist');
    });
}
async function loadPlaylist(msg, serverQueue, name) {
    if(!name) return msg.channel.send('name???');

    const vc = msg.member.voice.channel;
    if(!vc) return msg.reply('You aint in a vc');

    msg.react('👍');
    playlistSchema.findOne({ name: name, userID: msg.author.id }, async (err, playlist) => {
        if(!playlist) return msg.channel.send('Nuh uh');
        if(!serverQueue) {
            const queueConstructor = {
                tChannel: msg.channel,
                vChannel: vc,
                connection: null,
                songs: [],
                volume: 10,
                playing: true,
                loop: false,
            };
            queue.set(msg.guild.id, queueConstructor);

            // queueConstructor.songs.push(playlist.songs[0]);
            for (const song of playlist.songs) {
                queueConstructor.songs.push(song);
                // msg.channel.send(`Added \`${song.title}\` to the \`queue\``);
            }
            msg.channel.send('```nim\nSongs added:\n\n' + playlist.songs.map((song, id) =>
                `${id + 1}. ${song.title}`,
            ).join('\n') + '```');

            try {
                const connection = await vc.join();
                queueConstructor.connection = connection;
                play(msg.guild, queueConstructor.songs[0]);
            } catch (error) {
                console.error(error);
                queue.delete(msg.guild.id);
                return msg.channel.send('Unable to join vc :(');
            }
        } else {
            for (const song of playlist.songs) {
                serverQueue.songs.push(song);
                // return msg.channel.send(`Added \`${song.title}\` to the \`queue\``);
            }
            msg.channel.send('```nim\nSongs added:\n\n' + playlist.songs.map((song, id) =>
                `${id + 1}. ${song.title}`,
            ).join('\n') + '```');
        }
    });
}
function shuffleQ(msg, serverQueue) {
    if(!serverQueue) return msg.channel.send('U havent event played a song yet dumbass');
    if(!serverQueue.connection) return msg.channel.send('no music playin');
    if(!msg.member.voice.channel) return msg.channel.send('You aint in a vc ;-;');

    const newQueue = shuffle(serverQueue.songs);

    serverQueue.songs = newQueue;
    msg.react('👍');
    msg.channel.send('Shuffled');
    displayQ(msg, serverQueue);
}
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
}