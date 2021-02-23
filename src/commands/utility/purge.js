module.exports = {
    commands: ['purge'],
    expectedArgs: '<number>',
    maxArgs: 1,
    minArgs: 1,
    permissions: ['MANAGE_MESSAGES'],
    category: 'Utility',
    desc: 'Purges messages',
    callback: (msg, args) => {
        msg.channel.bulkDelete(parseInt(args[0]) + 1);
    },
};