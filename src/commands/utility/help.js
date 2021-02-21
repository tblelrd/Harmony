const Discord = require('discord.js');
const { prefix } = require('../../../config.json');

module.exports = {
    commands: ['help', 'h'],
    maxArgs: 0,
    dm: true,
    callback: (msg) => {
      if(msg.guild) {
        const h = new Discord.MessageEmbed()
        .addField('Music', `\`${prefix}music\` \`help\``)
        .addField('Other', '`ping`')
        .addField('Moderator', '`purge` `kick` `ban`')
        .addField('Anime', '`animesearch` `mangasearch` `doujin`')
				.addField('Minecraft', '`hypixelonline` `namehistory` `kdr` `server`')
        .setFooter('Made by Jackack');

        msg.channel.send(h);
      } else {
        const h = new Discord.MessageEmbed()
        .addField('Anime', '`animesearch` `mangasearch` `doujin`')
				.addField('Minecraft', '`hypixelonline` `namehistory` `kdr` `server`')
        .setFooter('Made by Jackack');

        msg.channel.send(h);
      }
    },
};