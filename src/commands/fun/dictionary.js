const { MessageEmbed } = require('discord.js');
const urban = require('relevant-urban');

module.exports = {
    commands: ['dictionary', 'urban', 'def', 'definition'],
    expectedArgs: '<word/s>',
    minArgs: 1,
    category: 'Fun',
    desc: 'Searches the word/s up on urban dictionary',
    callback: async (msg, args, text) => {
        const def_array = await urban.all(text);
        if(!def_array[0]) return msg.channel.semd('Downs\'t exist!');
        const def = def_array[Math.floor(Math.random() * def_array.length)];
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