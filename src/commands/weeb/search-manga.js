const { MessageEmbed } = require('discord.js');
const { Mal } = require('node-myanimelist');
const auth = Mal.auth('ec4cca9b42e3849db83b46986639783b');

module.exports = {
    commands: ['mangasearch', 'manga'],
    expectedArgs: '<name>',
    minArgs: 1,
    callback: async (msg, args, text) => {
        const search = await searchManga(text);
        const data = search.data[0].node;

        const e = new MessageEmbed()
        .setTitle(data.alternative_titles.en || data.title)
        .setImage(data.main_picture.large)
        .setFooter(data.authors[0].node.first_name || 'No author specified')
        .setURL('https://myanimelist.net/manga/' + data.id)
        .addField('Rank', `\`#${data.rank}\``, true)
        .addField('Popularity', `\`#${data.popularity}\``, true)
        .addField('Status', `\`${data.status}\``, true)
        .addField('Genres', data.genres.map((genre) => `\`${genre.name}\``).join(' ') || 'Somehow this manga doesnt have any Genres')
        .addField('Chapters', `\`${data.num_chapters || 'Unknown'}\``, true)
        .addField('Volumes', `\`${data.num_volumes || 'Unknown'}\``, true);

        await msg.channel.send(e);
        msg.channel.send(`\`\`\`${data.synopsis}\`\`\``);
    },
};

const searchManga = async (name) => {
    const account = await auth.Unstable.login('jackack', 'getjacked123');

    const search = await account.manga.search(
        name,
        Mal.Manga.fields().all(),
    ).call();

    if(!search) return null;
    return search;
};