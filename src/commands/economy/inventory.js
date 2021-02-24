/* eslint-disable no-prototype-builtins */
const { MessageEmbed } = require('discord.js');


module.exports = {
    commands: ['inventory', 'inv'],
    category: 'Economy',
    callback: async (msg, args, text, bot, profile) => {
        const e = new MessageEmbed()
        .setAuthor(msg.author.username, msg.author.avatarURL());

        const items = [];
        const itemNames = [];

        for(const item of profile.inventory) {

            if(itemNames.includes(item.name)) {
                items.map((i) => {
                    if(i.name == item.name) {
                        i.amount++;
                    }
                });
            } else {
                item.amount = 1;
                items.push(item);
                itemNames.push(item.name);
            }

            console.log(itemNames);
        }
        for(const item of items) {
            e.addField(item.name, `${[item.price]} coins\n${item.amount}`, true);
        }

        msg.channel.send(e);
    },
};