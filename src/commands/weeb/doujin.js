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
            .addField('Tags', data.tags.map((tag) => `\`${tag}\``).join(' ') || 'No tags', true);

            msg.channel.send(e);
        } catch {
            msg.reply('error');
        }
    },
    dm: true,
};

const findDoujin = async (id) => {
    const url = `https://nhentai.to/g/${id}`;

    const html = await rp(url);
    if(!html) return;
    const img = $('div > div > a > img[is=lazyload-image]', html)[1].attribs['data-src'];
    const title = $('div[id=info-block] > div[id=info] > h1', html).html();
    const tag = $('section > div:contains("Tags")', html).text().split(/[ ]+/).join(' ').split('\n').join(' ').split(/[ ]+/);
    tag.shift();
    tag.shift();
    tag.pop();
    const data = {
        img: img,
        title: title,
        url: url,
        tags: tag,
    };
    return data;
};

