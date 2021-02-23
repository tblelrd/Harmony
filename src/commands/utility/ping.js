module.exports = {
    commands: 'ping',
    permissionError: 'You don\'t have the perms to perform the command',
    minArgs: 0,
    maxArgs: 0,
    category: 'Utility',
    desc: 'I dont know why you need to be adnim but u kno',
    callback: (msg, args, text, bot) => {
        // Pong!
        msg.channel.send(`🏓Latency is \`${Date.now() - msg.createdTimestamp}ms\`. \nAPI Latency is \`${Math.round(bot.ws.ping)}ms\``);
    },
    permissions: 'ADMINISTRATOR',
};