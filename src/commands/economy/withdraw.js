const profileModel = require('../../models/profileSchem');

const { MessageEmbed } = require('discord.js');

module.exports = {
    commands: ['withdraw', 'with'],
    expectedArgs: '<amount>',
    minArgs: 1,
    maxArgs: 1,
    category: 'Economy',
    desc: 'Withdraw the money from the bank to your wallet',
    callback: async (msg, args, text, bot, profile) => {

        const amount = parseInt(args[0] == 'all' ? profile.bank : args[0]);
        if(!amount) return msg.reply('Ples enter number');

        await profileModel.findOneAndUpdate({ userID: msg.author.id }, {
            $inc: {
                coins: amount,
                bank: -amount,
            },
        });

        const e = new MessageEmbed()
        .setAuthor(msg.author.username, msg.author.avatarURL())
        .setDescription(`You withdrawed **${amount} coins**`);

        msg.channel.send(e);
    },
};