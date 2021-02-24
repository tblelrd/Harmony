const { MessageEmbed } = require('discord.js');

const profileModel = require('../../models/profileSchem');

module.exports = {
    commands: ['beg'],
    maxArgs: 0,
    cooldown: 20,
    category: 'Economy',
    callback: async (msg) => {
        const random = Math.floor(Math.random() * 500 - 1) + 1;
        await profileModel.findOneAndUpdate({ userID: msg.author.id }, {
            $inc: {
                coins: random,
            },
        });

        const e = new MessageEmbed()
        .setAuthor(msg.author.username, msg.author.avatarURL())
        .setDescription(`A stranger gave you **${random} coins**, how generous`);

        msg.channel.send(e);
    },
};