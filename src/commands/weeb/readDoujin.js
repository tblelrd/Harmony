const rp = require('request-promise');
const $ = require('cheerio');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const request = require('request').defaults({ encoding: null });


module.exports = {
    commands: ['readdoujin', 'rd'],
    expectedArgs: '<doujin number> <page>',
    minArgs: 2,
    maxArgs: 2,
    permissions: ['ADMINISTRATOR'],
    category: ['Weeb'],
    desc: 'Godly command',
    dm: true,
    callback: async (msg, args, text, bot) => {
        const pageNo = parseInt(args[1]) - 1;

        try {
            const data = await findDoujin(args[0]);
            if(!data) msg.reply('Invalid id or smthn');

            const message = await read(data, pageNo, msg);

            try {
                message.react('⬅');
                message.react('➡');
            } catch {
                console.log('Error while trying to react');
            }

            const collector = message.createReactionCollector(
                (reaction, user) => bot.users.cache.get((_user) => user.id == _user.id),
            );

            collector.on('collect', (reaction, user) => {
                console.log(user.username);
            });

        } catch(err) {
            console.log(err);
        }
    },
};

const read = async (data, pageNo, msg) => {
    const regex = /([0-9]+)t/;
    const yes = regex.exec(data.pages[pageNo]);
    if(!data.pages[pageNo]) return msg.channel.send('Page doesnt exist');

    request.get(data.pages[pageNo].replace(/[0-9]+t/, yes[1]), async (err, res, body) => {
        const attachment = new MessageAttachment(body, `${data.title}-${pageNo}.jpg`);
        const e = new MessageEmbed()
        .setTitle(parseInt(pageNo + 1))
        .attachFiles([attachment])
        .setImage(`attachment://${data.title}-${pageNo + 1}.jpg`);

        const embed = await msg.channel.send(e);
        console.log(embed);
        return embed;
    });

};

const findDoujin = async (id) => {
    const url = `https://nhentai.to/g/${id}`;
    const html = await rp(url);
    if(!html) return;
    const img = $('div > div > a > img[is=lazyload-image]', html)[1].attribs['data-src'];
    const title = $('div[id=info-block] > div[id=info] > h1', html).html();
    const _tag = $('section > div:contains("Tags")', html).text().split(/[ \n]{2,}/);
	const _chr = $('section > div:contains("Characters")', html).text().split(/[ \n]{2,}/);
	const lang = $('section > div:contains("Languages")', html).text().split(/[ \n]{2,}/);
	const chr = shiftnpop(_chr);
	const tag = shiftnpop(_tag);
    const pages = findPages($('div#thumbnail-container', html).html());
    const data = {
        pages: pages,
        img: img,
        title: title,
        url: url,
        tags: tag,
		chr: chr,
		lang: shiftnpop(lang),
    };
    return data;
};

const shiftnpop = (arr) => {
	arr.shift();
	arr.shift();
	arr.pop();
	return arr;
};

const findPages = (html) => {
    const regex = /<img.*?data-src="(.*?)"/gm;
    const linkRegex = /data-src="(.*)"/gm;

    const matches = html.match(regex);
    const links = [];
    let toggle = true;
    for(let i = 0; i < matches.length;) {
        const matching = linkRegex.exec(matches[i]);
        if(matching) {
            links.push(matching[1]);
        }
        toggle = !toggle;
        if(toggle) {
            i++;
        }
    }

    return links;
};