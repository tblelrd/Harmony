const { MessageEmbed } = require('discord.js');
const { Mal } = require('node-mymangalist');
const auth = Mal.auth('ec4cca9b42e3849db83b46986639783b');

module.exports = {
    commands: ['mangasearch', 'manga'],
    expectedArgs: '<name>',
    minArgs: 1,
    dm: true,
    category: 'Weeb',
    desc: 'Searches a manga in My manga List',
    callback: async (msg, args, text) => {
        try {
            const search = await searchManga(text);

            const mangalist = search.data.map(v => v.node).slice(0, 5);
            const displayList = mangalist.map((v, i) =>`${i + 1}. ${v.title}` ).join('\n');
    
            const message = await msg.channel.send(
                `\`\`\`nim\nManga Results:\n${displayList}\n\nPlease select one of the above (Using numbers!)\`\`\``
            );
            const collector = message.channel.createMessageCollector((m) => m.author.id == msg.author.id, { time: 30000 });

            collector.on('collect', async(m) => {
                const number = parseInt(m.content) 
                if(!number || number > 5) {
                    msg.channel.send('Please enter a number');
                    await m.delete();
                    return;
                }
    
                const data = search.data[number - 1].node;
                
                const e = new MessageEmbed()
                .setDescription(data.synopsis)
                .setTitle(data.alternative_titles.en || data.title)
                .setImage(data.main_picture.large)
                .setFooter(data.authors[0].node.first_name || 'No author specified')
                .setURL('https://mymangalist.net/manga/' + data.id)
                .addField('Rank', `#${data.rank}`, true)
                .addField('Popularity', `#${data.popularity}`, true)
                .addField('Status', `${toTitleCase(data.status)}`, true)
                .addField('Aired', `From ${data.start_date} ${data.end_date ? `to ${data.end_date}` : 'Still goin'}`, true)
                .addField('Genres', data.genres.map((genre) => `${genre.name}`).join(' ') || 'Somehow this manga doesnt have any Genres', true)
                .addField('Chapters', `${data.num_chapters || 'Unknown'}`, true)
                .addField('Volumes', `${data.num_volumes || 'Unknown'}`, true);
                
                await msg.channel.send(e);
            });
        } catch {
            msg.reply('Couldn\'t find the manga :(');
        }
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
const toTitleCase = (str) => {
    const noUnderscore = str.replace(/(_)/g, ' ');
    return noUnderscore.replace(
    /\w\S*/g,
    function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    },
    );
};