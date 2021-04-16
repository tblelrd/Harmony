const { MessageEmbed } = require('discord.js');
const puppeteer = require('puppeteer');

module.exports = {
    commands: ['reverseimage', 'ris'],
    maxArgs: 0,
    category: 'Fun',
    desc: 'Reverse image searches the image attached',
    /**
     *
     * @param {import('discord.js').Message} msg
     * @param {String[]} args
     * @param {String} text
     */
    callback: async (msg) => {
        const Attachment = (msg.attachments).array();
        if(checkIfNOTImage(Attachment[0] && Attachment[0].url)) return msg.channel.send('No Image found');
        const img = Attachment[0];

        const message = await msg.channel.send('Searching image, please wait...');

        const res = await ris(img.url);

        res.images.shift();
        const list = res.images.map((resImg, i) =>
            `[${resImg.title}](${resImg.url} "Related link no.${++i}")`,
        ).join('\n');

        const e = new MessageEmbed()
        .setTitle(`Found: ${res.search}`)
        .setURL(res.link)
        .setDescription(list);

        await message.delete();
        msg.channel.send(e);
    },
};

const urlRegex = /.*\.(.*)/g;
/**
 *
 * @param {String} url
 * @returns {Boolean}
 */
const checkIfNOTImage = (url) => {
    const regex = urlRegex.exec(url);
    if(!regex) return true;
    switch(regex[1]) {
        case 'png':
        case 'jpg':
            return false;
    }
    return true;
};

const ris = async (url) => {

    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto('https://www.google.com/searchbyimage?image_url=' + encodeURIComponent(url));

    try {
        await page.click('button#zV9nZe.tHlp8d');
    } catch (e) {
        //
    }

    const images = await page.evaluate(() => {
        return Array.from(document.body.querySelectorAll('div div a h3')).slice(2).map(e => e.parentNode).map(el => ({ url: el.href, title: el.querySelector('h3').innerHTML }));
    });
    const inputValue = await page.evaluate(() => {
        return document.body.querySelector('input.gLFyf.gsfi').value;
    });

    await page.click('div#iur > div > div > div > div > a');
    const link = page.url();

    await browser.close();

    return {
        link,
        images,
        search: inputValue,
    };
};