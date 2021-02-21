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
        try {
            victim.send(`You got banned from ${msg.guild.name}${reason ? ` for ${reason}` : null}`);
            msg.channel.send(`${victim} has been banned by ${msg.member}${reason ? ` for ${reason}` : null}`);
            victim.ban();
        } catch {
            msg.relpy('I cannot ban them');
        }
    },
};