/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');

const resourceFolder = path.join(__dirname, '../resources');

registerFont(path.join(resourceFolder, 'Montserrat-Regular.ttf'), { family: 'Montserrat' });

const toTDP = (num1, num2) => {
    // To 2 decimal points
    const output = (Math.floor((num1 / num2) * 100)) / 100;
    return output;
};

module.exports = async (stats) => {
    const {
        kills,
        deaths,
        fkills,
        fdeaths,
        bbreak,
        blosts,
        wins,
        losses,
        name,
        uuid,
        games,
    } = stats;
    const kdr = toTDP(kills, deaths);
    const fkdr = toTDP(fkills, fdeaths);
    const bblr = toTDP(bbreak, blosts);
    const wlr = toTDP(wins, losses);

    const background = await loadImage(`https://visage.surgeplay.com/bust/512/${uuid}.png`);
    const canvas = createCanvas(background.width * 2, background.height);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(background, 0, 0, background.width, background.height);

    ctx.strokeStyle = 'rgba(240, 102, 226, 0.79)';
    ctx.lineWidth = 5;
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

    const halfway = (canvas.width / 2) + 10;

    ctx.font = '30px Montserrat';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#000';
    ctx.fillText(`${name}'s stats:`, halfway + 160, canvas.height - 430);

    let text = 'Kdr: ' + kdr;
    ctx.font = '20px Montserrat';
    ctx.textAlign = 'left';
    ctx.fillText(text, halfway, canvas.height - 390);

    text = 'FKdr: ' + fkdr;
    ctx.fillText(text, halfway, canvas.height - 330);

    text = 'Bblr: ' + bblr;
    ctx.fillText(text, halfway, canvas.height - 270);

    text = 'Wlr: ' + wlr;
    ctx.fillText(text, halfway, canvas.height - 210);

    text = 'Average \nkills/game: ' + toTDP(kills, games);
    ctx.fillText(text, halfway, canvas.height - 150);

    text = 'Average \nfkills/game: ' + toTDP(fkills, games);
    ctx.fillText(text, halfway, canvas.height - 60);

    const buffer = canvas.toBuffer();
    return buffer;
};