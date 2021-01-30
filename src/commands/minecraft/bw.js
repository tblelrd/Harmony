const { MessageAttachment } = require('discord.js');
const hypixel = require('hypixel');
const client = new hypixel({
    key: 'bf5d8092-3665-4e93-9b6b-aa83b499e27b',
});

const bedwars = require('../../utils/bedwars');

module.exports = {
    commands: ['bedwars', 'bw'],
    expectedArgs: '<username>',
    minArgs: 1,
    maxArgs: 1,
    callback: (msg, args, text) => {
        client.getPlayerByUsername(args[0], (err, player) => {
            if(err) msg.reply('That person does not exist baka');
            const stats = {
                kills: player.stats.Bedwars.kills_bedwars,
                deaths: player.stats.Bedwars.deaths_bedwars,
                fkills: player.stats.Bedwars.final_kills_bedwars,
                fdeaths: player.stats.Bedwars.final_deaths_bedwars,
                bbreak: player.stats.Bedwars.beds_broken_bedwars,
                blosts: player.stats.Bedwars.beds_lost_bedwars,
                losses: player.stats.Bedwars.losses_bedwars,
                wins: player.stats.Bedwars.wins_bedwars,
                name: player.playername,
                uuid: player.uuid,
                games: player.stats.Bedwars.games_played_bedwars_1,
            };
            const attachment = new MessageAttachment(bedwars(stats), `${stats.name}'s Bedwars Stats`);
            msg.channel.send(`Here is \`${stats.name}'s\` bedwars stats`, attachment);
        });
    },
};