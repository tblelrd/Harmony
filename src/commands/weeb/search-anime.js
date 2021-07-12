const { MessageEmbed } = require('discord.js');
const { Mal } = require('node-myanimelist');
const auth = Mal.auth('ec4cca9b42e3849db83b46986639783b');

module.exports = {
    commands: ['animesearch', 'anims', 'anime'],
    expectedArgs: '<name>',
    minArgs: 1,
    dm: true,
    category: 'Weeb',
    desc: 'Searches an anime on My Anime List',
    callback: async (msg, args, text) => {
        try {
            const search = await searchAnime(text);

            const animelist = search.data.map(v => v.node).slice(0, 5);
            const displayList = animelist.map((v, i) =>`${i + 1}. ${v.title}` ).join('\n');
    
            const message = await msg.channel.send(
                `\`\`\`nim\nAnime Results:\n${displayList}\n\nPlease select one of the above (Using numbers!), or C to cancel\`\`\``
            );
            const collector = message.channel.createMessageCollector((m) => m.author.id == msg.author.id, { time: 30000 });

            collector.on('collect', async(m) => {
                const number = parseInt(m.content) 
                if (m.content.toLowerCase() == 'c') {
					try {
						await m.delete();
						await message.delete();
						await msg.delete();
					} catch (e) {
						//
					}
					collector.stop();
					return;
				} else if(!number || number > 5) {
                    msg.channel.send('Please enter a number');
					try {
						await m.delete();
					} catch (e) {
						//
					}
                    return;
                } 
    
                const data = search.data[number - 1].node;
                
                const e = new MessageEmbed()
                .setDescription(data.synopsis)
                .setTitle(data.alternative_titles.en || data.title)
                .setImage(data.main_picture.large)
                .setFooter(data.studios[0].name || 'No studio specified')
                .setURL('https://myanimelist.net/anime/' + data.id)
                .addField('Rank', `#${data.rank}`, true)
                .addField('Rating', `${toTitleCase(data.rating)}`, true)
                .addField('Popularity', `#${data.popularity}`, true)
                .addField('Aired', `From ${data.start_date} to ${data.end_date || 'still airing'}`, true)
                .addField('Status', `${toTitleCase(data.status)}`, true)
                .addField('Source', `${toTitleCase(data.source) || 'None'}`, true)
                .addField('Genres', data.genres.map((genre) => `${toTitleCase(genre.name)}`).join(' ') || 'Somehow this anime doesnt have any Genres', true)
                .addField('Episodes', `${data.num_episodes}`, true)
                .addField('Episode duration', `${Math.floor(data.average_episode_duration / 60) + 'm' || 'Forever'}`, true);
                
	            await msg.channel.send(e);
				try {
                	await m.delete();
					await message.delete();
				} catch (e) {

				}
				collector.stop();
            });
            } catch {
            msg.reply('Couldn\'t find the anime :(');
        }
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

const toTitleCase = (str) => {
    const noUnderscore = str.replace(/(_)/g, ' ');
    return noUnderscore.replace(
    /\w\S*/g,
    function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    },
    );
};