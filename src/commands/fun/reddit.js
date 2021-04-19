const { MessageEmbed } = require('discord.js');
const api = require('imageapi.js');

module.exports = {
    commands: ['reddit'],
    expectedArgs: '<subreddit>',
    minArgs: 1,
    maxArgs: 1,
    category: 'Fun',
    desc: 'Reddit stuff',
    callback: async (msg, args) => {
        try {
            const reddit = await api.advanced(args[0]);
            const e = new MessageEmbed()
            .setTitle(reddit.title)
            .setDescription(reddit.text)
            .setAuthor(`u/${reddit.author.toLowerCase()}`, null, `https://reddit.com/user/${reddit.author.toLowerCase()}`)
            .setColor('RANDOM')
            .setImage(reddit.img);
            msg.channel.send(e);
        } catch {
            msg.channel.send('Nope');
        }
    },
};