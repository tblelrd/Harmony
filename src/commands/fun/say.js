module.exports = {
    commands: ['say', 'repeat'],
    expectedArgs: '<text>',
    minArgs: 1,
    category: 'Fun',
    desc: 'Repeats what you say',
    callback: async (msg, args, text) => {
        const name = msg.member.nickname;
        const avatar = msg.author.avatarURL({ dynamic: true });

        await msg.delete();

        const webhook = await msg.channel.createWebhook('SayHook', { reason: 'Say' });
        await webhook.send(text, { username: name, avatarURL: avatar });

        await webhook.delete();
    },
};