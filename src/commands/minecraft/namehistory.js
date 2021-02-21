const MC = require('minecraft-api');

module.exports = {
    commands: ['namehistory', 'nh'],
    expectedArgs: '<username>',
    minArgs: 1,
    maxArgs: 1,
    dm: true,
    callback: async (msg, args) => {
        const cactus = await MC.nameForUuid('793884e374e142f3879613386f969e77');
        if(args[0] == cactus.toLowerCase()) return msg.channel.send('Nice try');

        const nameHistory = await MC.nameHistoryForName(args[0]).catch(err => {
          if (err) {
            msg.reply('U sure thats their name?');
            throw err;
          }
        });

        msg.channel.send(`\`${args[0]}\`:\n -` + nameHistory.map((name) => `\`${name.name}\``).join('\n -'));

    },
};