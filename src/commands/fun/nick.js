module.exports = {
    commands: ['disguise', 'disg', 'nick'],
    expectedArgs: '<userID> <text>',
    minArgs: 2,
    callback: async (msg, args, text, bot) => {
        const guild = msg.guild;
        const user = await bot.users.fetch(args[0]);
        if(!user) return msg.reply('They don exist');
        const member = guild.members.fetch(user);
        const name = member.nickname || user.username;
        const avatar = user.avatarURL();

        await msg.delete();

        args.shift();

        const webhook = await msg.channel.createWebhook('SayHook', { reason: 'Say' });
        await webhook.send(args.join(' '), { username: name, avatarURL: avatar });

        await webhook.delete();
    },
};