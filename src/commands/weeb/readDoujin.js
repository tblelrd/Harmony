const rp = require('request-promise');
const $ = require('cheerio');
const { MessageEmbed } = require('discord.js');


module.exports = {
    commands: ['readdoujin', 'rd'],
    expectedArgs: '<doujin number>',
    minArgs: 1,
    maxArgs: 1,
    permissions: ['ADMINISTRATOR'],
    category: ['Weeb'],
    desc: 'Godly command',
    dm: true,
    callback: async (msg, args) => {
        try {
            const data = await findDoujin(args[0]);
            if(!data) msg.reply('Invalid id or smthn');
            const e = new MessageEmbed()
            .setTitle(data.title)
            .setURL(data.url);

            for(const page of data.pages) {
                e.setImage(page);
                msg.channel.send(e);
            }
        } catch(err) {
            msg.reply(err);
        }
    },
};

const findPages = async (html) => {
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
