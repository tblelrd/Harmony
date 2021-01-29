const http = require('http');

module.exports = {
    event: async (bot) => {
        let connectedAmount = 0;
        const server = http.createServer((req, res) => {
            const hour = Math.floor((Date.now() - bot.startDate) / 1000 / 60 / 60);
            const min = Math.floor((Date.now() - bot.startDate) / 1000 / 60);
            const sec = Math.floor((Date.now() - bot.startDate) / 1000);
            res.writeHead(200);
            res.end('Pinged: ' + connectedAmount.toString() + '\n' +
             `Bot running for ${hour.toString()}:${(min - (hour * 60)).toString()}.${(sec - (min * 60)).toString()} (Hour:Min.Sec)`);
        });

        server.on('connection', socket => {
            connectedAmount++;
        });
        server.listen(3000);

    },
};