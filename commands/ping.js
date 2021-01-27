module.exports = {
    commands: 'ping',
    expectedArgs: '',
    permissionError: 'You don\'t have the perms to perform the command',
    minArgs: 0,
    maxArgs: 0,
    callback: (msg, args, text, bot) => {
        // Pong!
        msg.channel.send(`🏓Latency is \`${Date.now() - msg.createdTimestamp}ms\`. \nAPI Latency is \`${Math.round(bot.ws.ping)}ms\``);
    },
    permissions: 'ADMINISTRATOR',
    requiredRoles: ['Member'],
};