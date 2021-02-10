const server = require('minecraft-server-util');

module.exports = {
    commands: ['server', 'mcs'],
    expectedArgs: '<ip> [<port>]',
    minArgs: 1,
    maxArgs: 2,
    callback: async (msg, args) => {
        let ports = 25565;
        if (args[1]) ports = parseInt(args[1]);

        const check = await msg.channel.send(`Checking \`${args[0]}:${ports}\``);


        server.status(args[0], {
                port: ports,
            })
            .then((result) => {
                check.edit(`\`\`\`nim\n--${args[0]}--\n\nServer Ip: ${result.host} \nVersion: ${result.version} \nOnline Players: ${result.onlinePlayers}  \nMax Players: ${result.maxPlayers}\`\`\``);
            })
            .catch((err) => {
                if (err) console.log(err);
                check.edit('Server either doesnt exist or i did an oopsie');
            });


    },
};