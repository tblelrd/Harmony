const { MessageEmbed } = require('discord.js');
const { LeagueAPI } = require('../../../config.json');
const TeemoJS = require('teemojs');
const api = TeemoJS(LeagueAPI);

const validateRegions = (region) => {
    const regions = [
        'br1',
        'eun1',
        'euw1',
        'jp1',
        'kr',
        'la1',
        'la2',
        'na1',
        'oc1',
        'ru',
        'tr1',
    ];

    if(regions.includes(region.toLowerCase())) {
        return true;
    }
    return false;
};

const invalid = [];

module.exports = {
    commands: ['summoner'],
    desc: 'Info about a summoner',
    expectedArgs: '<region> <username>',
    minArgs: 2,
    category: 'League',
    dm: true,
    callback: async (msg, args) => {
        const region = args[0].toLowerCase();
        const e = new MessageEmbed()
        .setAuthor(msg.author.username, msg.author.avatarURL())
        .setTitle('League of legends api');
        if(!validateRegions(region)) {
            e.setDescription(`${region} is not a valid region`);
            msg.channel.send(e);
            return;
        }
        args.shift();
        const name = args.join(' ');

        const summoner = await api.get(region, 'summoner.getBySummonerName', name);
		if(summoner) {
			if(invalid.includes(summoner.id)) {
            	e.setDescription(`Couldn't find \`${name}\`\n Look at the spelling and try again${invalid.includes(summoner.id) && summoner.id ? '\n You have already looked this summoner up, \nplease stop as it would ban my api key if u spam it' : ''}`);
				msg.channel.send(e);
				return;	
			}
		} else {
            e.setDescription(`Couldn't find \`${name}\`\n Look at the spelling and try again${invalid.includes(summoner.id) && summoner.id ? '\n You have already looked this summoner up, \nplease stop as it would ban my api key if u spam it' : ''}`);
            msg.channel.send(e);
            return;
		}
        const league = await api.get(region, 'league.getLeagueEntriesForSummoner', summoner.id);
        if(!league[0] || !league[0].summonerId) {
            invalid.push(summoner.id);
            e.setDescription(`Couldn't find \`${name}\`\n` +
            'Maybe they don\'t play ranked?');
            msg.channel.send(e);
            return;
        }

        const info = league[0];

        e.setDescription(`Found ${name}!`)
        .setTitle(`${info.summonerName}'s stats`)
        .addField('Tier', `${toTitleCase(info.tier)} ${info.rank}`)
        .addField('Wins', `${info.wins}`)
        .addField('Losses', `${info.losses}`)
        .addField('Wlr', `${Math.floor((info.wins / info.losses) * 100) / 100}`)
        .addField('Queue Type', `${toTitleCase(info.queueType.split('_').join(' '))}`);

        msg.channel.send(e);
    },
};

const toTitleCase = (str) => {
    return str.replace(
        /\w\S*/g,
        (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        },
    );
};


/*
[
  {
    leagueId: '9a5f071c-c899-3750-b338-7b4eee40f8c0',
    queueType: 'RANKED_SOLO_5x5',
    tier: 'CHALLENGER',
    rank: 'I',
    summonerId: '3z3jNf6xcHXyf6z6RX8IYDC2_vot6kZU1_RWJ1JQ34kGRfw',
    summonerName: 'AST MagiFelix',
    leaguePoints: 735,
    wins: 122,
    losses: 99,
    veteran: true,
    inactive: false,
    freshBlood: false,
    hotStreak: false
  }
]
*/