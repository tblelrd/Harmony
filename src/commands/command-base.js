/* eslint-disable no-shadow-restricted-names */
/* eslint-disable no-shadow */
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
const { Client } = require('discord.js');
const {
    prefix,
} = require('../../config.json');

const profileModel = require('../models/profileSchem');

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

let recentlyrun = [];

/**
 *
 * @param {Client} client
 * @param {Object} commandOptions
 */
module.exports = (client, commandOptions) => {
    let {
        commands,
        expectedArgs = '',
        permissionError = 'Invalid permissions!',
        minArgs = 0,
        maxArgs = null,
        cooldown = -1,
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
    client.on('message', async msg => {
        if(msg.author.bot || msg.channel.type === 'dm') return;
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
                    if (!member.hasPermission(permission)) {
                        msg.reply(permissionError);
                        return;
                    }
                }

                let cooldownObj = {
                    gulidID: guild.id,
                    memberID: member.id,
                    command: commands[0],
                    time: Date.now(),
                };

                for(const run of recentlyrun) {
                    if(cooldown > 0 && run.guildID == cooldownObj.guildID && run.memberID == cooldownObj.memberID && run.command == cooldownObj.command) {
                        return msg.channel.send(`This command is on \`cooldown\` for another ${Math.floor(((run.time - Date.now()) / 1000) + cooldown)}s, please wait`);
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
                    msg.reply(`Incorrect Syntax! Use \`${prefix}${alias}${expectedArgs ? ` ${expectedArgs}` : ''}\``);
                    return;
                }
                let profileData;
                try {
                    profileData = await profileModel.findOne({ userID: msg.author.id });
                    if(!profileData) {
                        const profile = await profileModel.create({
                            userID: msg.author.id,
                            serverID: msg.guild.id,
                            coins: 1000,
                            bank: 0,
                        });
                        profile.save()
                        .then(res => {
                            console.log(`${msg.author.username} has been added to the economy`);
                        });
                    }
                } catch(err) {
                    console.log(err);
                }

                if(cooldown > 0) {
                    recentlyrun.push(cooldownObj);

                    setTimeout(() => {
                        recentlyrun = recentlyrun.filter((str) => {
                            return (
                                str.guildID !== cooldownObj.guildID
                                && str.memberID !== cooldownObj.memberID
                                && str.command !== cooldownObj.command
                            );
                        });
                    }, 1000 * cooldown);
                }

                // Handle the custom command code
                callback(msg, arguments, arguments.join(' '), client, profileData);

                return;
            }
        }
    });
};