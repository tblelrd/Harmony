module.exports = {
    commands: ['ban'],
    expectedArgs: ['<@member> [<reason?>]'],
    minArgs: 1,
    permissions: ['BAN_MEMBERS'],
    callback: (msg, args) => {
        args.shift();
        const reason = args.join(' ');
        const victim = msg.mentions.members.first();
        if(!victim) return msg.channel.send('Nope');
        if(!victim.bannable) return msg.reply('I couldnt ban them');
        try {
            victim.send(`You got banned from ${msg.guild.name}${reason ? ` for ${reason}` : ''}`);
            msg.channel.send(`${victim} has been banned by ${msg.member}${reason ? ` for ${reason}` : ''}`);
            victim.ban();
        } catch {
            msg.reply('I cannot ban them');
        }
    },
};