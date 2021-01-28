module.exports = {
    event: async (bot) => {
        let connectedAmount = 0;
        const http = require('http');
        const server = http.createServer((req, res) => {
            res.writeHead(200);
            res.end(connectedAmount.toString() + '\n' + (Math.floor((Date.now() - bot.startDate) / 1000 / 60 / 60)).toString() + ` hours since last launch (${Math.floor((Date.now() - bot.startDate) / 1000 / 60)}mins)`);
        });

        server.on('connection', socket => {
            connectedAmount++;
        });
        server.listen(3000);

    },
};