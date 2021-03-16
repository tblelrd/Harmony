const translate = require('translate');

module.exports = {
    commands: ['translate'],
    expectedArgs: '<fromLang> <toLang> <text>',
    minArgs: 3,
    category: 'Info',
    desc: 'Translates the word :/',
    callback: async (msg, args) => {
        const language = args[0];
        const toLang = args[1];
        args.shift();
        args.shift();
        const text = args.join(' ');

        try {

            const translation = await translate(text, { to: toLang, from: language, engine: 'libre' });

            const wh = await msg.channel.createWebhook('Translate bot');
            await wh.send(translation, { username: msg.member.nickname ? msg.member.nickname : msg.author.username, avatarURL: msg.author.avatarURL() });

            await wh.delete();
        } catch (err) {
            msg.reply('Not a valid language idiot');
        }
        msg.delete();
    },
};