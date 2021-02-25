const { MessageEmbed } = require('discord.js');

module.exports = {
    commands: ['balance', 'bal'],
    maxArgs: 0,
    category: 'Economy',
    desc: 'Checks your economy balance',
    callback: (msg, args, test, bot, profile) => {
        const e = new MessageEmbed()
        .setAuthor(msg.author.username, msg.author.avatarURL())
        .setDescription(`Wallet: ${profile.coins}\nBank: ${profile.bank}`);

        msg.channel.send(e);
    },
};