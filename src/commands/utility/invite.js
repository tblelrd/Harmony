module.exports = {
    commands: ['invite'],
    maxArgs: 0,
    callback: (msg) => {
        msg.channel.send('https://discord.com/api/oauth2/authorize?client_id=803556894487740447&permissions=8&redirect_uri=https%3A%2F%2Fdiscord.gg%2FAeXJxaE8&scope=bot');
    },
};