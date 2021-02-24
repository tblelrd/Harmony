const { MessageEmbed } = require('discord.js');
const shopModel = require('../../models/guildShop');

module.exports = {
    commands: ['setshop'],
    expectedArgs: '<shopName> <price> <itemName>',
    minArgs: 3,
    cooldown: 60,
    category: 'Economy',
    permissions: ['ADMINISTRATOR'],
    callback: async (msg, args, text, bot, profile) => {
        const shopName = args[0];
        const price = parseInt(args[1]);
        args.shift();
        args.shift();
        const name = args.join(' ');

        const e = new MessageEmbed()
        .setAuthor(msg.author.username, msg.author.avatarURL());

        let shop = await shopModel.findOne({ guildID: msg.guild.id });

        if(!shop) {
            shop = new shopModel({
                name: shopName,
                guildID: msg.guild.id,
                items: [
                    {
                        name: name,
                        price: price,
                    },
                ],
            });

            shop.save();
            e.setDescription(`${msg.author} has created a new SHOP`);
        } else {
            shop = new shopModel({
                name: shopName,
                guildID: msg.guild.id,
                items: [
                    {
                        name: name,
                        price: price,
                    },
                ],
            });

            shop.save();
            e.setDescription('Shop changed');
        }

        msg.channel.send(e);

    },
};