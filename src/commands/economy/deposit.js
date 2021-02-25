const profileModel = require('../../models/profileSchem');

const { MessageEmbed } = require('discord.js');

module.exports = {
    commands: ['deposit', 'dep'],
    expectedArgs: '<amount>',
    minArgs: 1,
    maxArgs: 1,
    category: 'Economy',
    desc: 'Deposits your money into the bank',
    callback: async (msg, args, text, bot, profile) => {

        const amount = parseInt(args[0] == 'all' ? profile.coins : args[0]);
        if(!amount) return msg.reply('specify an actual amount thanks');

        await profileModel.findOneAndUpdate({ userID: msg.author.id }, {
            $inc: {
                bank: amount,
                coins: -amount,
            },
        });

        const e = new MessageEmbed()
        .setAuthor(msg.author.username, msg.author.avatarURL())
        .setDescription(`You deposited **${amount} coins**`);

        msg.channel.send(e);
    },
};