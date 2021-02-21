module.exports = {
    event: async (bot) => {
        bot.on('message', msg => {
            const { content } = msg;

            const eachLine = content.split('\n');
            if(!content.includes('?')) return;
            if(content.includes('¬')) return;

            for (const line of eachLine) {
                if(line.includes('=')) {
                    const split = line.split('=');
                    const emoji = split[0].trim();
                    msg.react(emoji);
                }
            }
        });
    },
};