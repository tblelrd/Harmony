/* eslint-disable no-shadow-restricted-names */
/* eslint-disable no-shadow */
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
const {
    prefix,
} = require('../../config.json');


module.exports = (client, commandOptions) => {
    let {
        commands,
        expectedArgs,
        minArgs = 0,
        maxArgs = null,
        callback,
    } = commandOptions;

    // Ensure the command and aliases are in an array
    if (typeof commands === 'string') {
        commands = [commands];
    }

    // Listen for messages
    client.on('message', msg => {
        if(msg.author.bot || msg.guild) return;
        const {
            content,
        } = msg;
        for (const alias of commands) {
            if (content.toLowerCase().split(' ')[0] == `${prefix}${alias.toLowerCase()}`) {
                // A command is running

                // Split any number of spaces
                const arguments = content.split(/[ ]+/);

                // Remove the command ast the first index
                arguments.shift();

                // Arguments checking
                if (arguments.length < minArgs || (
                        maxArgs !== null && arguments.length > maxArgs
                    )) {
                    msg.reply(`Incorrect Syntax! Use \`${prefix}${alias} ${expectedArgs}\``);
                    return;
                }

                // Handle the custom command code
                callback(msg, arguments, arguments.join(' '), client);

                return;
            }
        }
    });
};