module.exports = {
    commands: ['kick'],
    expectedArgs: '<@member> [<reason?>]',
    minArgs: 1,
    permissions: ['KICK_MEMBERS'],
    category: 'Moderator',
    desc: 'Kicks a user',
    callback: (msg, args) => {
        args.shift();
        const reason = args.join(' ');
        const victim = msg.mentions.members.first();
        if(!victim) return msg.channel.send('Nope');
        if(!victim.kickable) return msg.reply('I couldnt kick them');
        if(victim.roles.highest.position >= msg.member.roles.highest.position) return msg.reply('Can\'t do that');
        try {
            victim.send(`You got kicked from ${msg.guild.name}${reason ? ` for ${reason}` : ''}`);
            msg.channel.send(`${victim} has been kicked by ${msg.member}${reason ? ` for ${reason}` : ''}`);
            victim.kick();
        } catch{
            msg.reply('I cannot kick them');
        }
    },
};