'use strict';

module.exports = function (req, res, next) {
    if (['red', 'green', 'blue'].indexOf(req.params.color) > -1) {
        // map the colors to the right GPI
        let map = {
            red: 1,
            green: 2,
            blue: 3
        };

        // I am not sure about this line
        // Board.write(map[req.params.color]);

        res.send(200, {
            color: req.params.color,
            status: true
        });
    } else {
        res.send(500, { error: 'color not correct' });
    }

    next();
};
