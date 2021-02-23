const { MessageEmbed, MessageAttachment } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dices = [];
for(let i = 1; i <= 6; i++) {
    fs.readFile(path.join(__dirname, `../../bin/dice/${i}.png`), (err, buffer) => {
        if(err) return console.log(`${i} Failed`);

        dices.push(buffer);
    });
}

module.exports = {
    commands: ['roll'],
    maxArgs: 0,
    category: 'Fun',
    desc: 'Rolls the dice',
    callback: (msg) => {
        const random = Math.floor(Math.random() * 6);

        const dice = new MessageAttachment(dices[random - 1], `${random.toString()}.png`);

        const e = new MessageEmbed()
        .setDescription(`**You rolled a ${random}!**`)
        .attachFiles(dice)
        .setImage(`attachment://${dice.name}`);

        msg.channel.send(e);
    },
};