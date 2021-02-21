const { prefix } = require('../../../config.json');
module.exports = {
    commands: ['startdm', 'sdm'],
    maxArgs: 0,
    callback: (msg) => {
        msg.author.send(`\`${prefix}help\` to view a list of commands available`);
    },
};