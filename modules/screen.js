'use strict';

const i2c = require('i2c-bus'),
    sleep = require('sleep'),
    GrovePi = require('node-grovepi').GrovePi,
    Board = GrovePi.board;

var DISPLAY_RGB_ADDR = 0x62;
var DISPLAY_TEXT_ADDR = 0x3e;

let lcdInput = { name: 'TEST'};

function setRGB(i2c1, rgb) {
    i2c1.writeByteSync(DISPLAY_RGB_ADDR,0,0);
    i2c1.writeByteSync(DISPLAY_RGB_ADDR,1,0);
    i2c1.writeByteSync(DISPLAY_RGB_ADDR,0x08,0xaa);
    i2c1.writeByteSync(DISPLAY_RGB_ADDR,4,rgb[0]);
    i2c1.writeByteSync(DISPLAY_RGB_ADDR,3,rgb[1]);
    i2c1.writeByteSync(DISPLAY_RGB_ADDR,2,rgb[2]);
}

function textCommand(i2c1, cmd) {
    i2c1.writeByteSync(DISPLAY_TEXT_ADDR, 0x80, cmd);
}

function setText(i2c1, text) {
    textCommand(i2c1, 0x01); // clear display
    sleep.usleep(50000);
    textCommand(i2c1, 0x08 | 0x04);// display on, no cursor
    textCommand(i2c1, 0x28); // 2 lines
    sleep.usleep(50000);
    var count = 0;
    var row = 0;
    for(var i = 0, len = text.length; i < len; i++) {
        if(text[i] === '\n' || count === 16) {
            count = 0;
            row ++;
            if(row === 2)
                break;
            textCommand(i2c1, 0xc0);
            if(text[i] === '\n')
            continue;
        }
        count++;
        i2c1.writeByteSync(DISPLAY_TEXT_ADDR, 0x40, text[i].charCodeAt(0));
    }
}

module.exports.post = function (req, res) {
    const colors = {
        red: [255, 0, 0],
        green: [0, 255, 0],
        blue: [0, 0, 255]
    };

    var messageArr = req.body.message.split(' ');
    var color = Object.keys(colors).find(r => messageArr.indexOf(r));
    var rgb = colors.red;

    if (Object.keys(colors).indexOf(color) > -1) {
        rgb = colors[color];
    }

    var i2c1 = i2c.openSync(1);
    setText(i2c1, req.body.message);
    setRGB(i2c1, rgb);
    i2c1.closeSync();

    res.send(200, { message: req.body.message });
};




function onExit(err) {
    screenBoard.close();
    process.removeAllListeners();
    process.exit();
    if (typeof err != 'undefined')
        console.log(err);
}

// catches ctrl+c event
process.on('SIGINT', onExit);
