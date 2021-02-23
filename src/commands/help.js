const {
    MessageEmbed,
} = require('discord.js');
const {
    registerCommands,
    registerDm,
} = require('../utils/register');
const {
    prefix,
} = require('../../config.json');

const commands = registerCommands();
const dmCommands = registerDm();

module.exports = {
    commands: ['help', 'h'],
    maxArgs: 1,
    dm: true,
    category: 'Utility',
    desc: 'Help screen',
    callback: (msg, args, text, bot) => {
        const e = new MessageEmbed();
        if (msg.guild) {
            commands.shift();
            e.setTitle('Help Categories')
            .setAuthor(bot.user.username, bot.user.avatarURL());

            for(const command of commands) {
                let permissions = command.permissions;
                if(typeof permissions === 'string') {
                    permissions = [permissions];
                }
                for(const permission of permissions) {
                    if(!msg.member.hasPermission(permission)) {
                        const i = commands.indexOf(command);
                        commands.splice(i, 1);
                    }
                }
            }

            const categories = [];
            for (const command of commands) {
                if (command.commands) {
                    if (args[0] == command.commands.includes(args[0])) {
                        e.setTitle('Command help');
                        e.addField(`${command.aliases[0]}`, `${command.desc ? command.desc : 'No desc set'}`);
                        return msg.channel.send(e);
                    }
                    if (!command.category) command.category = 'Other';
                    if (!categories.includes(command.category)) {
                        categories.push(command.category);
                    }

                }
            }
            for(const category of categories) {
                const result = [];
                let res = '';
                for(const command of commands) {
                    let aliases = command.commands;
                    if(typeof aliases === 'string') {
                        aliases = [aliases];
                    }
                    if(command.category == category) {
                        result.push(aliases[0]);
                    }
                }
                res = result.map((cmd) => `\`${cmd}\``).join('\n');
                e.addField(category, res ? res : 'res', true);
            }
        } else {
            dmCommands.shift();
            e.setTitle('Help Categories')
            .setAuthor(bot.user.username, bot.user.avatarURL());

            const categories = [];
            for (const dmCommand of dmCommands) {
                if (dmCommand.dmCommands) {
                    if (args[0] == dmCommand.dmCommands.includes(args[0])) {
                        e.setTitle('Command help');
                        e.addField(`${dmCommand.aliases[0]}`, `${dmCommand.desc ? dmCommand.desc : 'No desc set'}`);
                        return msg.channel.send(e);
                    }
                    if (!dmCommand.category) dmCommand.category = 'Other';
                    if (!categories.includes(dmCommand.category)) {
                        categories.push(dmCommand.category);
                    }

                }
            }
            for(const category of categories) {
                const result = [];
                let res = '';
                for(const dmCommand of dmCommands) {
                    let aliases = dmCommand.dmCommands;
                    if(typeof aliases === 'string') {
                        aliases = [aliases];
                    }
                    if(dmCommand.category == category) {
                        result.push(aliases[0]);
                    }
                }
                res = result.map((cmd) => `\`${cmd}\``).join('\n');
                e.addField(category, res ? res : 'res', true);
            }
        }
        msg.channel.send(e);
    },
};