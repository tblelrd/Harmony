const Discord = require('discord.js');
const { prefix } = require('../config.json')

module.exports = {
    commands: ['help', 'h'],
    maxArgs: 0,
    callback: (msg, args, text) => {
        console.log('hi');
        const h = new Discord.MessageEmbed()
        .addField('Music', `\`${prefix}music\`and then \`play\` \`stop\` \`queue\` \`skip\` \`loop\` \`pause\` \`resume\` \`help\``)
        .addField('Other', '`ping`')
				.addField('Minecraft', '`Honline` `namehistory` `kdr` `server`')
        .setFooter('Made by Jackack');

        msg.channel.send(h);
    },
};