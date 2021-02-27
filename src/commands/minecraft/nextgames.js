const { MessageEmbed } = require('discord.js');
const MC = require('minecraft-api');
const hypixel = require('hypixel');

const statsModel = require('../../models/playerStats');

const client = new hypixel({
    key: 'bf5d8092-3665-4e93-9b6b-aa83b499e27b',
});

const gamemodes = [
    'bw',
    'bedwars',
    'bedwar',
    // 'skywars',
    // 'skywar',
    // 'sw',
    // 'duels',
    // 'duel',
];

module.exports = {
    commands: ['nextgames'],
    expectedArgs: '<username> <gamemode> <amount>',
    minArgs: 3,
    maxArgs: 3,
    category: 'Minecraft',
    desc: 'Stats for the next games of a specific gamemode for a specific player',
    callback: async (msg, args) => {
		const amount = parseInt(args[2]);
		if(!amount || amount < 1 || amount >= 10) {
			msg.reply('Please specify an amount between 1 and 10');
			return;
		}
        const mode = args[1].toLowerCase();
        const e = new MessageEmbed()
        .setAuthor(msg.author.username, msg.author.avatarURL());
        const playerUuid = await MC.uuidForName(args[0]);
        if(!playerUuid) {
            e.setDescription(`Couldn't find username \`<${args[0]}>\``);
            msg.channel.send(e);
            return;
        }
        const stats = await client.getPlayer(playerUuid);
        if(!stats) {
            e.setDescription(`Couldn't find <${args[0]}> in the hypixel api, \nmaybe try again after logging in`);
            msg.channel.send(e);
            return;
        }
        if(!gamemodes.includes(mode)) {
            e.setDescription(`Invalid gamemode \nValid ones: \n${gamemodes.map(gamemode => `\`${gamemode}\``).join(' ')}`);
            msg.channel.send(e);
            return;
        }

        switch(mode) {
            case 'bw':
            case 'bedwars':
            case 'bedwar':
                wait5games(stats, 'bw', msg);
            break;

            // case 'sw':
            // case 'skywars':
            // case 'skywar':
            //     info = skywars(stats.stats.Skywars);
            //     wait5games(info, 'sw');
            // break;

            // case 'duel':
            // case 'duels':
            //     info = duels(stats);
            //     wait5games(info, 'duels');
            // break;
        }
        e.setDescription(`Started data for ${stats.displayname}`);
        msg.channel.send(e);
    },
};

const bedwars = (oldStats, stats, amount) => {
    let {
        kills_bedwars,
        deaths_bedwars,
        final_kills_bedwars,
        final_deaths_bedwars,
        beds_broken_bedwars,
        beds_lost_bedwars,
        losses_bedwars,
        wins_bedwars,
        games_played_bedwars,
    } = stats;

    const {
        o_kills_bedwars,
        o_deaths_bedwars,
        o_final_kills_bedwars,
        o_final_deaths_bedwars,
        o_beds_broken_bedwars,
        o_beds_lost_bedwars,
        o_losses_bedwars,
        o_wins_bedwars,
        o_games_played_bedwars,
    } = oldStats;

    kills_bedwars -= o_kills_bedwars;
    deaths_bedwars -= o_deaths_bedwars;
    final_kills_bedwars -= o_final_kills_bedwars;
    final_deaths_bedwars -= o_final_deaths_bedwars;
    beds_broken_bedwars -= o_beds_broken_bedwars;
    beds_lost_bedwars -= o_beds_lost_bedwars;
    losses_bedwars -= o_losses_bedwars;
    wins_bedwars -= o_wins_bedwars;
    games_played_bedwars -= o_games_played_bedwars;

    const info = {
        kills: kills_bedwars,
        deaths: deaths_bedwars,
        kdr: Math.floor((kills_bedwars / (deaths_bedwars ? deaths_bedwars : 1)) * 100) / 100,
        fKills: final_kills_bedwars,
        fDeaths: final_deaths_bedwars,
        fkdr: Math.floor((final_kills_bedwars, (final_deaths_bedwars ? final_deaths_bedwars : 1)) * 100) / 100,
        bBroke: beds_broken_bedwars,
        bLost: beds_lost_bedwars,
        bblr: Math.floor((beds_broken_bedwars, (beds_lost_bedwars ? beds_lost_bedwars : 1)) * 100) / 100,
        losses: losses_bedwars,
        wins: wins_bedwars,
        wlr: Math.floor((wins_bedwars, (losses_bedwars ? losses_bedwars : 1)) * 100) / 100,
        played: games_played_bedwars,
		amount: amount,
    };

    return info;

};


const wait5games = async (info, mode, amount, msg) => {
    if(mode == 'bw') {
        const stats = await client.getPlayer(info.uuid);
        const gamesPlayed = stats.stats.Bedwars.games_played_bedwars;
        const oldGamesPlayed = info.stats.Bedwars.games_played_bedwars;
        if(gamesPlayed < oldGamesPlayed + amount) {
            setTimeout(async () => {
                await wait5games(info, mode, amount, msg);
                return;
            }, 30000);
            return;
        }
        console.log('Waiting finished');

        const bedwarsStats = bedwars(info.stats.Bedwars, stats.stats.Bedwars, amount);

        const playerStats = await statsModel.findOne({ uuid: info.uuid });
        if(!playerStats) {
            const statSchema = new statsModel({
                uuid: info.uuid,
            });
            const res = await statSchema.save();
            console.log(res);
            await statsModel.findOneAndUpdate({ uuid: info.uuid }, {
                $push: {
                    stats: bedwarsStats,
                },
            });
            return;
        }
        await statsModel.findOneAndUpdate({ uuid: info.uuid }, {
            $push: {
                stats: bedwarsStats,
            },
        });
		const e = new MessageEmbed()
		.setAuthor(msg.author.name, msg.author.avatarURL())
        .setTitle(`\`<${info.displayname}>\`'s stats for the past 5 games`)
        .addField('KDR', `${bedwarsStats.kills} / ${bedwarsStats.deaths}: ${bedwarsStats.kdr}`)
        .addField('FKDR', `${bedwarsStats.fKills} / ${bedwarsStats.fDeaths}: ${bedwarsStats.fkdr}`)
        .addField('BBLR', `${bedwarsStats.bBroke} / ${bedwarsStats.bLost}: ${bedwarsStats.bblr}`)
        .addField('WLR', `${bedwarsStats.wins} / ${bedwarsStats.losses}: ${bedwarsStats.wlr}`);

        msg.channel.send(e);
    }
};