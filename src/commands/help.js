const { MessageEmbed } = require('discord.js');
const { registerCommands, registerDm } = require('../utils/register');
const { prefix } = require('../../config.json');

const commands = registerCommands();
const dmCommands = registerDm();

module.exports = {
    commands: ['help', 'h'],
    maxArgs: 0,
    dm: true,
    category: 'Utility',
    desc: 'Help screen',
    callback: (msg, args, text, bot) => {
      const e = new MessageEmbed();
      if(msg.guild) {
          commands.shift();
          e.setTitle('Help Categories')
          .setAuthor(bot.user.username, bot.user.avatarURL());

          const categories = [];
          for(const command of commands) {
              if(command.commands) {
								console.log('command.commands')
                  if(args[0] == command.commands.includes(args[0])) {
                      e.setTitle('Command help');
                      e.addField(`${command.aliases[0]}`, `${command.desc ? command.desc : 'No desc set'}`);
                      return msg.channel.send(e);
                  }
                  if(!command.category) command.category = 'Other';
                  if(!categories.includes(command.category)) {
                    categories.push(command.category);
                  }

              }
          }
      } else {
        dmCommands.shift();
        e.setTitle('Help Categories')
        .setAuthor(bot.user.username, bot.user.avatarURL());

        const categories = [];
        for(const dmCommand of dmCommands) {
            if(dmCommand.name || dmCommand.aliases) {
                if(args[0] == dmCommand.name || dmCommand.aliases.includes(args[0])) {
                    e.setTitle('dmCommand help');
                    e.addField(`${dmCommand.name ? dmCommand.name : dmCommand.aliases[0]}`, `${dmCommand.desc ? dmCommand.desc : 'No desc set'}`);
                    return msg.channel.send(e);
                }
                if(!dmCommand.category) dmCommand.category = 'Other';
                if(!categories.includes(dmCommand.category)) {
                  categories.push(dmCommand.category);
                }

            }
        }
      }
      msg.channel.send(e);
    },
};