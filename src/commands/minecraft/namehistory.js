const MC = require('minecraft-api');
const map = new Map()

module.exports = {
    commands: ['namehistory', 'nh'],
    expectedArgs: '<username>',
    minArgs: 1,
    maxArgs: 1,
    callback: async (msg, args, text) => {
        const cactus = await MC.nameForUuid('793884e374e142f3879613386f969e77');
        if(args[0] == cactus.toLowerCase()) return msg.channel.send('Nice try');

        const nameHistory = await MC.nameHistoryForName(args[0]).catch(
					msg.reply('i ran into an oopsie')
				);

        msg.channel.send(`\`${args[0]}\`:\n -`+ nameHistory.map((name, names) => `\`${name.name}\``).slice(0, 10).join('\n -'));
        
				/*
				let i;
        for (i = 0; i < nameHistory.length; i++) {
            msg.channel.send(`- \`${nameHistory[i].name}\``);
        }
				*/
    },
};