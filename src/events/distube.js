// Queue status template
const status = (queue) => `Loop: \`${queue.repeatMode ? queue.repeatMode == 2 ? 'Queue' : 'Song' : 'Off'}\` |  Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``;

module.exports = {
    event: async (bot) => {
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

    },
};