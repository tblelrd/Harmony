const rp = require('request-promise');
const $ = require('cheerio');

module.exports = {
    commands: ['doujin', 'hentai'],
    expectedArgs: '<inconspicuous 6 digit number>',
    minArgs: 1,
    maxArgs: 1,
    permision: ['ADMINISTRATOR'],
    callback: async (msg, args) => {
        const data = await findDoujin(args[0]);
        msg.reply(data.img);
    },
};

const findDoujin = async (id) => {
    const url = `https://nhentai.to/g/${id}`;

    const html = await rp(url);
    const img = $('div > div > a > img[is=lazyload-image]', html)[1].attribs['data-src'];
    const tags = $('div > div > secion[id=tags]', html);
    const data = {
        img: img,
        tags: tags,
    };
    return data;
};

