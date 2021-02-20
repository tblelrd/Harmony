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

const readCommands = async (bot, dir) => {
    const files = fs.readdirSync(path.join(__dirname, '../', dir));
    for (const file of files) {
        const stat = fs.lstatSync(path.join(__dirname, '../', dir, file));
        if (stat.isDirectory()) {
            readCommands(bot, path.join(dir, file));
        } else if (file.endsWith('.js') && file !== commandBaseName && file !== dmCommandBaseName) {
            const options = require(path.join(__dirname, '../', dir, file));
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

const readDmCommands = async (bot, dir) => {
    const files = fs.readdirSync(path.join(__dirname, '../', dir));
    for (const file of files) {
        const stat = fs.lstatSync(path.join(__dirname, '../', dir, file));
        if (stat.isDirectory()) {
            readDmCommands(bot, path.join(dir, file));
        } else if (file.endsWith('.js') && file !== dmCommandBaseName && file !== commandBaseName) {
            const options = require(path.join(__dirname, '../', dir, file));
            if (!options.commands || !options.dm || !options.callback) {
                //
            } else {
                console.log(file + ' loaded');
                dmCommandBase(bot, options);
            }
        }
    }
};

module.exports = {
    registerEvents: async (bot, dir) => {
        readEvents(bot, dir);
        console.log(table(eventStatus, tableConfig.options));
    },
    registerCommands: async (bot, dir) => {
        readCommands(bot, dir);
        console.log(table(commandStatus, tableConfig.options));
    },
    registerDm: async (bot, dir) => {
        readDmCommands(bot, dir);
    },
};