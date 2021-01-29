/* eslint-disable no-unused-vars */
const Discord = require('discord.js');
const { prefix } = require('../../config.json');
const status = (queue) => `Loop: ${queue.repeatMode ? queue.repeatMode == 2 ? 'Queue' : 'Song' : 'Off'} |  Autoplay: ${queue.autoplay ? 'On' : 'Off'}`;

module.exports = {
    commands: ['music', 'm'],
    expectedArgs: '<command> [<other>]',
    minArgs: 1,
    callback: (msg, args, text, bot) => {
        switch(args[0]) {
            case 'p':
            case 'play':
                if(!args[1]) return msg.channel.send('You need a song jeez');
                args.shift();
                bot.distube.play(msg, args.join(' '));
            break;

            case 'loop':
            case 'l':
            case 'repeat':
                bot.distube.setRepeatMode(msg, parseInt(args[0]));
                msg.channel.send('Toggling `loop`');
            break;

            case 'stop':
                bot.distube.stop(msg);
                msg.channel.send('Stopped the music!');
            break;

            case 's':
            case 'skip':
                bot.distube.skip(msg);
            break;

            case 'q':
            case 'queue':
                const queue = bot.distube.getQueue(msg);
                msg.channel.send('```nim\nCurrent queue:\n\n' + queue.songs.map((song, id) =>
                    `${id + 1}. ${song.name} - ${song.formattedDuration}`,
                ).slice(0, 10).join('\n') + '\n\n' + status(queue) + '```');
            break;


            case 'ur':
            case 'unresume':
            case 'pause':
                bot.distube.pause(msg);
                msg.channel.send('Song is `paused`');
            break;

            case 'r':
            case 'up':
            case 'unpause':
            case 'resume':
                bot.distube.resume(msg);
                msg.channel.send('Song is `unpaused`');
            break;

						case 'j':
						case 'join':
								bot.distube
						break;

            case 'jump':
                if(!args[1]) return msg.channel.send('Song number');

                bot.distube.jump(msg, parseInt(args[1]));
            break;

            case 'auto':
            case 'autoplay':
                const mode = bot.distube.toggleAutoplay(msg);
                msg.channel.send('Set autoplay mode to `' + (mode ? 'On' : 'Off') + '`');
            break;

            case 'h':
            case 'help':
                const h = new Discord.MessageEmbed()
                .setTitle('Help')
                .setThumbnail(bot.user.avatarURL())
                .setColor('#000000')
                .addField('Commands', '`play` `stop` `queue` `skip` `loop` `pause` `resume` `help`')
                .setFooter('Made by Jackack');

                msg.channel.send(h);
            break;
        }
    },
};