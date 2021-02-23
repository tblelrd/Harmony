const gis = require('g-i-s');

module.exports = {
    commands: ['img'],
    expectedArgs: '<anything>',
    minArgs: 1,
    category: 'Fun',
    desc: 'Searches on google and send a random image from the results (also this is nsfw so uh)',
    callback: (msg, args, text) => {
        gis(text, (err, res) => {
            if(err) return msg.channel.send('There was an error');

            msg.channel.send(res[Math.floor(Math.random() * 50)].url);
        });
    },
};