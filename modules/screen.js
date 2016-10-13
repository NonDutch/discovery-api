var i2c = require('i2c-bus');
var sleep = require('sleep');
var GrovePi = require('node-grovepi').GrovePi;

var Board = GrovePi.board;

var DISPLAY_RGB_ADDR = 0x62;
var DISPLAY_TEXT_ADDR = 0x3e;

let lcdInput = { name: 'TEST'};

function setRGB(i2c1, r, g, b) {
    i2c1.writeByteSync(DISPLAY_RGB_ADDR,0,0);
    i2c1.writeByteSync(DISPLAY_RGB_ADDR,1,0);
    i2c1.writeByteSync(DISPLAY_RGB_ADDR,0x08,0xaa);
    i2c1.writeByteSync(DISPLAY_RGB_ADDR,4,r);
    i2c1.writeByteSync(DISPLAY_RGB_ADDR,3,g);
    i2c1.writeByteSync(DISPLAY_RGB_ADDR,2,b)
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
    for(var i = 0, len = text.length; i &lt; len; i++) {
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

let screenBoard = new Board({
    debug: true,
    onError: function(err) {
        console.log('Something wrong just happened');
        console.log(err)
    },
    onInit: onInit
});

function onInit (result) {
    if (result) {
        console.log('GrovePi Version :: ' + screenBoard.version());

        var i2c1 = i2c.openSync(1);
        setText(i2c1, 'Memet is een\nEINDBAAS');
        setRGB(i2c1, 55, 55, 255);
        i2c1.closeSync();

    } else {
        console.log(`Result: ${result}`);
    }
}

screenBoard.init();

module.exports.post = function (req, res) {
    res.send(200, { name: 'TEST'});
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