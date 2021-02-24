const { MessageEmbed } = require('discord.js');
const shopModel = require('../../models/guildShop');
const profileModel = require('../../models/profileSchem');
const { prefix } = require('../../../config.json');

const pinkPhallic = {
    name: 'Pink Phallic Object',
    price: 10,
};

module.exports = {
    commands: ['shop', 'buy'],
    cooldown: 5,
    category: 'Economy',
    callback: async (msg, args, text, bot, profile) => {
        const e = new MessageEmbed();
        const shop = await shopModel.findOne({ guildID: msg.guild.id });
        if(!shop) {
            e.setAuthor(msg.guild.name, msg.guild.iconURL())
            .setDescription(`Your server currently doesn have a shop\nSet up your shop by \`${prefix}setshop <shopName> <itemName> <price>\``);
            // shop = new shopModel({
            //     guildID: msg.guild.id,
            //     items: [ pinkPhallic ],
            // });
            // shop.save()
            // .then(res => console.log(res));
        }

        if(!args[0]) {
            e.setAuthor(shop.name, msg.guild.iconURL());

            for(const item of shop.items) {
                e.addField(`__${item.name}__`, `${item.price} coins`);
            }

            msg.channel.send(e);
        } else {
            for(const item of shop.items) {
                if(item.name.toLowerCase() == text) {
                    if(profile.coins < item.price) return msg.reply('You dont have enough money');

                    await profileModel.findOneAndUpdate({ userID: msg.author.id }, {
                        $inc: {
                            coins: -item.price,
                        },
                        $push: {
                            inventory: item,
                        },
                    });
                    e.setAuthor(msg.author.username, msg.author.avatarURL())
                    .setDescription(`**${item.name}** added to your inventory`);
                    msg.channel.send(e);
                }
            }
        }
    },
};