const { MessageAttachment, MessageEmbed } = require('discord.js');
const MC = require('minecraft-api');
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
    dm: true,
    category: 'Minecraft',
    desc: 'Hypixel bedwars stats in an image',
    callback: async (msg, args) => {

        const e = new MessageEmbed()
        .setAuthor(msg.author.username, msg.author.avatarURL());

        const uuid = await MC.uuidForName(args[0]);
        if(!uuid) return console.log('Errorrrr');
        const name = await MC.nameForUuid(uuid);
        if(!name) return console.log('this shouldnt ever happen');

        client.getPlayerByUsername(name, (err, player) => {
            if(err) return msg.reply('there wos error'), console.log(err);
            if(!player) return msg.reply('They don exist');
            try {
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
                bedwars(stats)
                .then(Buffer => {
                    const attachment = new MessageAttachment(Buffer, `${name}-Bedwars-Stats.png`);

                    e.attachFiles(attachment)
                    .setDescription(`${name}'s bedwars stats`)
                    .setImage(`attachment://${name}-Bedwars-Stats.png`);
                    msg.channel.send(e);
                })
                .catch(err => {
                    console.log(err);
                    e.setDescription('There was an error :(');

                    msg.channel.send(e);
                });
            } catch(err) {
                console.log(err);
                e.setDescription('There was an error :(');

                msg.channel.send(e);
            }
        });
    },
};