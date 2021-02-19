const { MessageEmbed } = require('discord.js');
const { Mal } = require('node-myanimelist');
const auth = Mal.auth('ec4cca9b42e3849db83b46986639783b');

module.exports = {
    commands: ['animesearch', 'anims'],
    expectedArgs: '<name>',
    minArgs: 1,
    callback: async (msg, args, text) => {
        const search = await searchAnime(text);
        const data = search.data[0].node;

        const e = new MessageEmbed()
        .setTitle(data.alternative_titles.en || data.title)
        .setImage(data.main_picture.large)
        .setFooter(data.studios[0].name || 'No studio specified')
        .setURL('https://myanimelist.net/anime/' + data.id)
        .addField('Rank', `\`#${data.rank}\``, true)
        .addField('Rating', `\`${data.rating}\``, true)
        .addField('Popularity', `\`#${data.popularity}\``, true)
        .addField('Source', `\`${data.source || 'None'}\``)
        .addField('Genres', `\`${data.node.genres.map((genre) => `${genre.name}`).join(', ') || 'Somehow this anime doesnt have any Genres'}\``, true)
        .addField('Episodes', `\`${data.num_episodes}\``)
        .addField('Episode duration', `\`${Math.floor(data.average_episode_duration / 60) + 'm' || 'Forever'}\``, true);

        await msg.channel.send(e);
        msg.channel.send(`\`\`\`${data.synopsis}\`\`\``);
    },
};

const searchAnime = async (name) => {
    const account = await auth.Unstable.login('jackack', 'getjacked123');

    const search = await account.anime.search(
        name,
        Mal.Anime.fields().all(),
    ).call();

    if(!search) return null;
    return search;
};