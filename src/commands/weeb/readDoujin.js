const rp = require('request-promise');
const $ = require('cheerio');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const request = require('request').defaults({ encoding: null });

// https://t.nhentai.net/galleries/{number}/{page}.jpg
module.exports = {
    commands: ['readdoujin', 'rd'],
    expectedArgs: '<doujin number> <page>',
    minArgs: 1,
    maxArgs: 2,
    permissions: ['ADMINISTRATOR'],
    category: ['Weeb'],
    desc: 'Godly command',
    dm: true,
    callback: async (msg, args, text, bot) => {
        let pageNo = parseInt(args[1]) - 1;
        if(!pageNo) pageNo = 0;
        const data = await findDoujin(args[0]);
        if(!data) msg.reply('Invalid id or smthn');

        try {
            read(data, pageNo, msg, bot);

        } catch(err) {
            console.log(err);
        }
    },
};

const read = async (data, pageNo, msg, bot) => {

    const message = await sendEmbed(data, pageNo, msg);
    const collector = message.createReactionCollector(
        (reaction, user) => bot.users.cache.find((_user) => _user.id == user.id).id !==
        bot.user.id,
    );

    collector.on('collect', (reaction) => {
        switch(reaction.emoji.name) {
            case '⬅':
                read(data, pageNo - 1, msg, bot);
            break;
            case '➡':
                read(data, pageNo + 1, msg, bot);
            break;
        }
    });
};

const sendEmbed = async (data, pageNo, msg) => {
    const pleaseWait = await msg.channel.send('Please wait as the image takes a while to load');

    console.log('e');
    const body = await doRequest(`https://t.nhentai.net/galleries/${data.id}/${pageNo}.jpg`);
    console.log('e');
    const attachment = new MessageAttachment(body, `${data.title}-${pageNo + 1}.jpg`);
    const e = new MessageEmbed()
    .setTitle(parseInt(pageNo + 1))
    .attachFiles([attachment])
    .setImage(`attachment://${data.title}-${pageNo + 1}.jpg`);

    const message = await msg.channel.send(e);
    await pleaseWait.delete();

    try {
        message.react('⬅');
        message.react('➡');
    } catch {
        console.log('Error while trying to react');
    }

    return message;

};

function doRequest(url) {
    return new Promise(function (resolve, reject) {
      request(url, function (error, res, body) {
        if (!error && res.statusCode == 200) {
          resolve(body);
        } else {
          reject(error);
        }
      });
    });
  }

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
        id,
	};
	return data;
};


// const findPages = (html) => {
//     const regex = /<img.*?data-src="(.*?)"/gm;
//     const linkRegex = /data-src="(.*)"/gm;

//     const matches = html.match(regex);
//     const links = [];
//     let toggle = true;
//     for(let i = 0; i < matches.length;) {
//         const matching = linkRegex.exec(matches[i]);
//         if(matching) {
//             links.push(matching[1]);
//         }
//         toggle = !toggle;
//         if(toggle) {
//             i++;
//         }
//     }

//     return links;
// };