const rp = require('request-promise');
const $ = require('cheerio');
const { MessageEmbed } = require('discord.js');

module.exports = {
    commands: ['doujin', 'hentai'],
    expectedArgs: '<inconspicuous 6 digit number>',
    minArgs: 1,
    maxArgs: 1,
    permissions: ['ADMINISTRATOR'],
    callback: async (msg, args) => {
        const data = await findDoujin(args[0]);
        if(!data) msg.reply('Invalid id or smthn');

        const e = new MessageEmbed()
        .setTitle(data.title)
        .setURL(data.url)
        .setImage(data.img);

        msg.channel.send(e);
    },
    dm: true,
};

const findDoujin = async (id) => {
    const url = `https://nhentai.to/g/${id}`;

    const html = await rp(url);
    if(!html) return;
    const img = $('div > div > a > img[is=lazyload-image]', html)[1].attribs['data-src'];
    const title = $('div[id=info-block] > div[id=info] > h1', html).html();
    const data = {
        img: img,
        title: title,
        url: url,
    };
    return data;
};

