const { MessageEmbed } = require('discord.js');
const { prefix } = require('../../../config.json');

module.exports = {
    commands: ['invite'],
    maxArgs: 0,
    dm: true,
    category: 'Utility',
    desc: 'Sends an embed of an invite link so I can join your server!',
    callback: (msg, args, text, bot) => {
        try {
            const e = new MessageEmbed()
            .setTitle('Link to invite me to your server')
            .setURL('https://discord.com/api/oauth2/authorize?client_id=803556894487740447&permissions=4294442999&redirect_uri=https%3A%2F%2Fdiscord.gg%2FAeXJxaE8&scope=bot')
            .setDescription(`\`${prefix}help\` to display help`)
            .setAuthor(bot.user.username, bot.user.avatarURL());

            msg.channel.send(e);
        } catch {
            msg.reply('err');
        }
    },
};