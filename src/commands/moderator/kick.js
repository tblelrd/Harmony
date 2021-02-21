module.exports = {
    commands: ['kick'],
    expectedArgs: '<@member> [<reason?>]',
    minArgs: 1,
    permissions: ['KICK_MEMBERS'],
    callback: (msg, args) => {
        args.shift();
        const reason = args.join(' ');
        const victim = msg.mentions.members.first();
        if(!victim) return msg.channel.send('Nope');
        try {
            victim.send(`You got kicked from ${msg.guild.name}${reason ? ` for ${reason}` : ''}`);
            msg.channel.send(`${victim} has been kicked by ${msg.member}${reason ? ` for ${reason}` : ''}`);
            victim.kick();
        } catch{
            msg.reply('I cannot kick them');
        }
    },
};