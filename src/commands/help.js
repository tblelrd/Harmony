const Discord = require('discord.js');
const { prefix } = require('../../config.json');

module.exports = {
    commands: ['help', 'h'],
    maxArgs: 0,
    callback: (msg) => {
        const h = new Discord.MessageEmbed()
        .addField('Music', `\`${prefix}music\` \`help\``)
        .addField('Other', '`ping`')
				.addField('Minecraft', '`hypixelonline` `namehistory` `kdr` `server`')
        .setFooter('Made by Jackack');

        msg.channel.send(h);
    },
};