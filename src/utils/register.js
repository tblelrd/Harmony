const fs = require('fs');
const path = require('path');
const tableConfig = require('./tableConfig');
const {
    table,
} = require('table');
const c = require('ansi-colors');
const commandStatus = [
    [`${c.bold('Command')}`, `${c.bold('Status')}`],
];
const eventStatus = [
    [`${c.bold('Event')}`, `${c.bold('Status')}`],
];

const commandBaseName = 'command-base.js';
const commandBase = require('../commands/command-base');
const eventBaseName = 'event-base.js';
const eventBase = require('../events/event-base');
const dmCommandBaseName = 'dm-command-base.js';
const dmCommandBase = require('../commands/dm-command-base');

const commands = [];
const readCommands = (bot, dir) => {
    const files = fs.readdirSync(path.join(__dirname, '../', dir));
    for (const file of files) {
        const stat = fs.lstatSync(path.join(__dirname, '../', dir, file));
        if (stat.isDirectory()) {
            readCommands(bot, path.join(dir, file));
        } else if (file.endsWith('.js') && file !== commandBaseName && file !== dmCommandBaseName) {
            const options = require(path.join(__dirname, '../', dir, file));
            if(bot) {
                if (!options.commands || !options.callback) {
                    commandStatus.push(
                        [`${c.cyan(file)}`, `${c.bgRed('Failed')}`],
                    );
                } else {
                    commandBase(bot, options);
                    commandStatus.push(
                        [`${c.cyan(file)}`, `${c.bgGreen('Loaded')}`],
                    );
                }
            } else {
                commands.push(options);
            }
        }
    }
};

const readEvents = async (bot, dir) => {
    const files = fs.readdirSync(path.join(__dirname, '../', dir));
    for (const file of files) {
        const stat = fs.lstatSync(path.join(__dirname, '../', dir, file));
        if (stat.isDirectory()) {
            readEvents(bot, path.join(dir, file));
        } else if (file.endsWith('.js') && file !== eventBaseName) {
            const options = require(path.join(__dirname, '../', dir, file));
            if (!options.event) {
                eventStatus.push(
                    [`${c.cyan(file)}`, `${c.bgRed('Failed')}`],
                );
            } else {
                eventStatus.push(
                    [`${c.cyan(file)}`, `${c.bgGreen('Loaded')}`],
                );
                eventBase(bot, options);
            }
        }
    }
};

const dmCommands = [];
const readDmCommands = (bot, dir) => {
    const files = fs.readdirSync(path.join(__dirname, '../', dir));
    for (const file of files) {
        const stat = fs.lstatSync(path.join(__dirname, '../', dir, file));
        if (stat.isDirectory()) {
            readDmCommands(bot, path.join(dir, file));
        } else if (file.endsWith('.js') && file !== dmCommandBaseName && file !== commandBaseName) {
            const options = require(path.join(__dirname, '../', dir, file));
            if(bot) {
                if (!options.commands || !options.dm || !options.callback) {
                    //
                } else {
                    dmCommandBase(bot, options);
                }
            } else if(options.dm) {
                    dmCommands.push(options);
            }
        }
    }
};

module.exports = {
    registerEvents: async (bot) => {
        readEvents(bot, 'events');
        console.log(table(eventStatus, tableConfig.options));
    },
    registerCommands: (bot) => {
        readCommands(bot, 'commands');
        if(bot) console.log(table(commandStatus, tableConfig.options));
        return commands;
    },
    registerDm: (bot) => {
        readDmCommands(bot, 'commands');
        return dmCommands;
    },
};