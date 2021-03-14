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
			.addField('Characters', data.characters.map((chr) => `\`${chr}\``).join(' ') || 'None specified', true)
			.addField('Languages', data.langs.map((lang) => `\`${lang}\``).join(' ') || 'None specified', true);

            msg.channel.send(e);
        } catch {
            msg.reply('error');
        }
    },
    dm: true,
};

const findDoujin = async (id) => {
    const url = `https://nhentai.net/g/${id}`;

	const tags = [];
	const characters = [];
	const langs = [];

    const html = await rp(url);
	const img = $('div > div > a > img.lazyload', html)[1].attribs['data-src'];
    const title = $('div[id=info-block] > div[id=info] > h1 > span.pretty', html).html();
    $('section > div:contains(Tags:) > span.tags > a > span.name', html).each((i, element) => tags.push($(element).html()));
	$('section > div:contains(Characters:) > span.tags > a > span.name', html).each((i, element) => characters.push($(element).html()));
	$('section > div:contains(Languages:) > span.tags > a > span.name', html).each((i, element) => langs.push($(element).html()));

	const data = {
		html,
		img,
		title,
		tags,
		characters,
		langs,
	};
	return data;
};
