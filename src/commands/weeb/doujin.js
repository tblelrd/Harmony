/* eslint-disable no-inline-comments */
const rp = require('request-promise');
const $ = require('cheerio');
const { MessageEmbed } = require('discord.js');

module.exports = {
    commands: ['doujin', 'hentai'],
    expectedArgs: '<inconspicuous 6 digit number>',
    minArgs: 1,
    maxArgs: 1,
    permissions: ['ADMINISTRATOR'],
    category: 'Weeb',
    desc: 'Searches a doujin by its id (works in dms if u know what i mean)',
    callback: async (msg, args) => {
        try {
            const data = await findDoujin(args[0]);
            if(!data) msg.reply('Invalid id or smthn');

            const e = new MessageEmbed()
            .setTitle(data.title)
            .setURL(data.url)
            .setImage(data.img)
            .addField('Tags', data.tags.map((tag) => `\`${tag}\``).join(' ') || 'No tags', true)
			.addField('Characters', data.chr.map((chr) => `\`${chr}\``).join(' ') || 'None specified', true)
			.addField('Languages', data.lang.map((lang) => `\`${lang}\``).join(' ') || 'None specified', true);

            msg.channel.send(e);
        } catch {
            msg.reply('error');
        }
    },
    dm: true,
};

const findDoujin = async (id) => {
    const url = `https://nhentai.net/g/${id}`;

    const html = await rp(url);
    if(!html) return;
    const img = $('div > div > a > img[is=lazyload-image]', html)[1].attribs['data-src'];
    const title = $('div[id=info-block] > div[id=info] > h1', html).html();
    const _tag = $('section > div:contains("Tags")', html).text().split(/[ \n]{2,}/);
	const _chr = $('section > div:contains("Characters")', html).text().split(/[ \n]{2,}/);
	const lang = $('section > div:contains("Languages")', html).text().split(/[ \n]{2,}/);
	const chr = shiftnpop(_chr); // idk why but first 2 elements are nothing and the last one is also nothing
	const tag = shiftnpop(_tag);
    const data = {
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

