/* eslint-disable no-shadow-restricted-names */
/* eslint-disable no-shadow */
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
const {
    prefix,
} = require('../../config.json');

const validatePermissions = (permissions) => {
    // eslint-disable-next-line no-shadow
    const validatePermissions = [
        'ADD_REACTIONS',
        'ADMINISTRATOR',
        'BAN_MEMBERS',
        'CHANGE_NICKNAME',
        'CONNECT',
        'CREATE_INSTANT_INVITE',
        'DEAFEN_MEMBERS',
        'EMBED_LINKS',
        'KICK_MEMBERS',
        'MANAGE_CHANNELS',
        'MANAGE_EMOJIS',
        'MANAGE_GUILD',
        'MANAGE_MESSAGES',
        'MANAGE_NICKNAMES',
        'MANAGE_ROLES',
        'MANAGE_WEBHOOKS',
        'MENTION_EVERYONE',
        'MOVE_MEMBERS',
        'MUTE_MEMBERS',
        'PRIORITY_SPEAKER',
        'READ_MESSAGE_HISTORY',
        'SEND_MESSAGES',
        'SEND_TTS_MESSAGES',
        'SPEAK',
        'STREAM',
        'USE_EXTERNAL_EMOJIS',
        'USE_VAD',
        'VIEW_AUDIT_LOG',
        'VIEW_CHANNEL',
        'VIEW_GUILD_INSIGHTS',
    ];

    for (const permission of permissions) {
        if (!validatePermissions.includes(permission)) {
            throw new Error(`Unknown permission node "${permission}"`);
        }
    }
};

module.exports = (client, commandOptions) => {
    let {
        commands,
        expectedArgs,
        permissionError = 'No thanks',
        minArgs = 0,
        maxArgs = null,
        permissions = [],
        // requiredRoles = [],
        callback,
    } = commandOptions;

    // Ensure the command and aliases are in an array
    if (typeof commands === 'string') {
        commands = [commands];
    }

    // Ensure the permissions are in an array and are all valid
    if (permissions.length) {
        if (typeof permissions === 'string') {
            permissions = [permissions];
        }

        validatePermissions(permissions);
    }
    // Listen for messages
    client.on('message', msg => {
        const {
            member,
            content,
            guild,
        } = msg;
        for (const alias of commands) {
            if (content.toLowerCase().split(' ')[0] == `${prefix}${alias.toLowerCase()}`) {
                // A command is running

                // Permission check
                for (const permission of permissions) {
                    if (!member.hasPermission(permissions)) {
                        msg.reply(permissionError);
                        return;
                    }
                }

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
                callback(msg, arguments, arguments.join(' '), client, content);

                return;
            }
        }
    });
};