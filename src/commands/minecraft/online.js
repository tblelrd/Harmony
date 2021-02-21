const hypixel = require('hypixel');
const client = new hypixel({
    key: 'bf5d8092-3665-4e93-9b6b-aa83b499e27b',
});

module.exports = {
    commands: ['honline', 'hon', 'hypixelonline', 'hypixelon'],
    expectedArgs: '<username>',
    minArgs: 1,
    maxArgs: 1,
    dm: true,
    callback: (msg, args) => {

        client.getPlayerByUsername(args[0], (err, player) => {
            if(err) throw err;
            if(!player) return msg.reply('they dont exist');

            if(player.lastLogin > player.lastLogout) {
                msg.channel.send(`\`<${player.displayname}>\` is currently \`online\``);
            } else {
                msg.channel.send(`\`<${player.displayname}>\` is currently \`offline\``);
            }
        });


    },
};