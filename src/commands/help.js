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

const Commands = registerCommands();
const dmCommands = registerDm();
Commands.shift();
dmCommands.shift();

let commands;

module.exports = {
    commands: ['help', 'h'],
    expectedArgs: '[<command?>]',
    maxArgs: 1,
    dm: true,
    category: 'Utility',
    desc: 'Help screen',
    callback: (msg, args, text, bot) => {
        const e = new MessageEmbed();
        commands = Commands;
        if (!args[0]) {
            if (msg.guild) {
                e.setTitle('Help Categories')
                .setAuthor(bot.user.username, bot.user.avatarURL());

                for (const command of commands) {
                    let permissions = command.permissions;
                    const i = commands.indexOf(command);
                    commands[i].allowed = true;
                    if (permissions) {
                        if (typeof permissions === 'string') {
                            permissions = [permissions];
                        }
                        for (const permission of permissions) {
                            if (!msg.member.hasPermission(permission)) {
                                commands[i].allowed = false;
                            }
                        }
                    }
                }

                const categories = [];
                for (const command of commands) {
                    if (command.commands) {
                        // let aliases = command.commands;
                        // if(typeof aliases == 'string') {
                        //     aliases = [aliases];
                        // }
                        // if (args[0]) {
                        //     for (const alias of aliases) {
                        //         isf (args[0] == alias) {
                        //             e.setTitle('Command help');
                        //             e.addField(`${alias}`, `${command.desc ? command.desc : 'No desc set'}`);
                        //             return msg.channel.send(e);
                        //         }
                        //     }
                        // }
                        if (!command.category) command.category = 'Other';
                        if (!categories.includes(command.category)) {
                            categories.push(command.category);
                        }

                    }
                }
                for (const category of categories) {
                    const result = [];
                    let res = '';
                    for (const command of commands) {
                        let aliases = command.commands;
                        if (typeof aliases === 'string') {
                            aliases = [aliases];
                        }
                        if (command.category == category) {
                            if (command.allowed) {
                                result.push(aliases[0]);
                            }
                        }
                    }
                    res = result.map((cmd) => `\`${cmd}\``).join('\n');
                    if (res) e.addField(category, res, true);
                }
            } else {
                e.setTitle('Help Categories')
                .setAuthor(bot.user.username, bot.user.avatarURL());

                const categories = [];
                for (const dmCommand of dmCommands) {
                    if (dmCommand.commands) {
                        // if (args[0] == dmCommand.commands.includes(args[0])) {
                        //     e.setTitle('Command help');
                        //     e.addField(`${dmCommand.aliases[0]}`, `${dmCommand.desc ? dmCommand.desc : 'No desc set'}`);
                        //     return msg.channel.send(e);
                        // }
                        if (!dmCommand.category) dmCommand.category = 'Other';
                        if (!categories.includes(dmCommand.category)) {
                            categories.push(dmCommand.category);
                        }

                    }
                }
                for (const category of categories) {
                    const result = [];
                    let res = '';
                    for (const dmCommand of dmCommands) {
                        let aliases = dmCommand.commands;
                        if (typeof aliases === 'string') {
                            aliases = [aliases];
                        }
                        if (dmCommand.category == category) {
                            result.push(aliases[0]);
                        }
                    }
                    res = result.map((cmd) => `\`${cmd}\``).join('\n');
                    e.addField(category, res ? res : 'res', true);
                }
            }
        } else if(msg.guild) {
            e.setAuthor(bot.user.username, bot.user.avatarURL());
            let aliasCheck = false;

            for(const command of Commands) {
				if(command.commands) {
                    let aliases = command.commands;
                    if(typeof aliases == 'string') {
                        aliases = [aliases];
                    }

					for(const alias of aliases) {
						if(alias == args[0]) {
							aliasCheck = true;
							e.setTitle(`Command: ${alias}`)
							.setDescription(`Correct Syntax: \`${prefix}${alias}${command.expectedArgs ? ` ${command.expectedArgs}` : ''}\`\n` +
							`${command.desc ? command.desc : 'No description set, sorry'}`);
						}
					}
				}
            }

            if(!aliasCheck) e.setTitle(`Command name "${args[0]}" not found`);

        } else {
            e.setAuthor(bot.user.username, bot.user.avatarURL());
            let aliasCheck = false;

            for(const command of dmCommands) {
                if(command.commands) {
                    let aliases = command.commands;
                    if(typeof aliases == 'string') {
                        aliases = [aliases];
                    }
                    for(const alias of aliases) {
                        if(alias == args[0]) {
                            aliasCheck = true;
                            e.setTitle(`Command: ${alias}`)
                            .setDescription(`Correct Syntax: \`${prefix}${alias}${command.expectedArgs ? ` ${command.expectedArgs}` : ''}\`\n` +
                            `${command.desc ? command.desc : 'No description set, sorry'}`);
                        }
                    }
                }
            }
            if(!aliasCheck) e.setTitle(`Command name "${args[0]}" not found`);
        }
        msg.channel.send(e);
    },
};