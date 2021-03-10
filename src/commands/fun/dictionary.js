const { MessageEmbed } = require('discord.js');
const urban = require('relevant-urban');

module.exports = {
    commands: ['dictionary', 'urban'],
    expectedArgs: '<word/s>',
    minArgs: 1,
    category: 'Fun',
    desc: 'Searches the word/s up on urban dictionary',
    callback: async (msg, args, text) => {
        const def = await urban(text);
        if(!def) return msg.channel.semd('Downs\'t exist!');
        const e = new MessageEmbed()
        .setAuthor(msg.author.username, msg.author.avatarURL())
        .setTitle(def.word)
        .setURL(def.urbanURL)
        .setFooter(`By ${def.author}`);

        e.setDescription(`**${urbanReplace(def.definition)}**${def.example ? `\n *Example: \n${urbanReplace(def.example)}*` : ''}`);

        msg.channel.send(e);
    },
};

const urbanReplace = (string) => {
    return string.toString().replace(/[[\]]/g, '');
};