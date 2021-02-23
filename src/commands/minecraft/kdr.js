/* eslint-disable no-unused-vars */
const hypixel = require('hypixel');
const client = new hypixel({
    key: 'bf5d8092-3665-4e93-9b6b-aa83b499e27b',
});

module.exports = {
    commands: ['kdr'],
    expectedArgs: '<username> <gamemode> [<other?>]',
    minArgs: 2,
    maxArgs: 3,
    dm: true,
    category: 'Minecraft',
    desc: 'Hypixel kill death ratio in 3 game types',
    callback: (msg, args, text) => {

        client.getPlayerByUsername(args[0], (err, player) => {
            if(err) throw err;
            if(!player) return msg.reply('they don exist');


            switch(args[1]) {
                case 'bw':
                case 'bedwar':
                case 'bedwars':
                    const bkills = player.stats.Bedwars.kills_bedwars;
                    const bdeaths = player.stats.Bedwars.deaths_bedwars;
                    const fkills = player.stats.Bedwars.final_kills_bedwars;
                    const fdeaths = player.stats.Bedwars.final_deaths_bedwars;


                    if (args[2]) return msg.channel.send(`${player.displayname}'s fkdr is: \`${Math.round(fkills / fdeaths * 100) / 100}\``);
                    msg.channel.send(`${player.displayname}'s kdr is: \`${Math.round(bkills / bdeaths * 100) / 100}\``);

                break;

                case 'sw':
                case 'skywar':
                case 'skywars':
                    const skills = player.stats.SkyWars.kills;
                    const sdeaths = player.stats.SkyWars.deaths;

                    msg.channel.send(`${player.displayname}'s kdr is: \`${Math.round(skills / sdeaths * 100) / 100}\``);
                break;

                case 'duels':
                case 'duel':
                    const dkills = player.stats.Duels.kills;
                    const ddeath = player.stats.Duels.deaths;

                    msg.channel.send(`${player.displayname}'s kdr is: \`${Math.round(dkills / ddeath * 100) / 100}\``);
                break;
            }
        });


    },
};