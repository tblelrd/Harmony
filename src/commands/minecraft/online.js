const hypixel = require('hypixel');
const client = new hypixel({
    key: 'a1c67aa3-0916-4cfe-819d-22546dcac453',
});

module.exports = {
    commands: ['honline', 'hon'],
    expectedArgs: '<username>',
    minArgs: 1,
    maxArgs: 1,
    callback: (msg, args, text) => {

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