const { MessageEmbed } = require('discord.js');
const shopModel = require('../../models/guildShop');

module.exports = {
    commands: ['additem'],
    expectedArgs: '<price> <itemName>',
    minArgs: 3,
    cooldown: 60,
    category: 'Economy',
    permissions: ['ADMINISTRATOR'],
    callback: async (msg, args, text, bot, profile) => {
        const price = parseInt(args[0]);
        args.shift();
        const name = args.join(' ');

        const e = new MessageEmbed()
        .setAuthor(msg.author.username, msg.author.avatarURL());

        if(!price) {
            e.setDescription('Wheres the price bro');
            return msg.channel.send(e);
        }

        if(price > profile.coins + profile.bank) {
            e.setDescription('You can\'t set the price higher than your entire net worth');
            return msg.channel.send(e);
        }

        await shopModel.findOneAndUpdate({ guildID: msg.guild.id }, {
            $push: {
                items: {
                    name: name,
                    price: price,
                },
            },
        });

        e.setDescription(`Added item **${name}**`);
        msg.channel.send(e);

    },
};