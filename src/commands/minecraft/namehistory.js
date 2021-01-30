const MC = require('minecraft-api');
const map = new Map();

module.exports = {
    commands: ['namehistory', 'nh'],
    expectedArgs: '<username>',
    minArgs: 1,
    maxArgs: 1,
    callback: async (msg, args, text) => {
        const cactus = await MC.nameForUuid('793884e374e142f3879613386f969e77');
        if(args[0] == cactus.toLowerCase()) return msg.channel.send('Nice try');

        const nameHistory = await MC.nameHistoryForName(args[0]).catch(err => {
          if (err) {
            msg.reply('U sure thats their name?');
            throw err;
          }
        });

        msg.channel.send(`\`${args[0]}\`:\n -` + nameHistory.map((name, names) => `\`${name.name}\``).join('\n -'));

    },
};