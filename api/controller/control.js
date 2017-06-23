/**
 * Created by tevonial on 6/22/2017.
 */

var router = require('express').Router();
var mongoose = require('mongoose');
var Control = mongoose.model('Control');

var jwtParse = require('../config/jwt');

router.get('/',     getConfig);
router.put('/', jwtParse, updateConfig);

module.exports = router;

function getConfig(req, res) {
    Control.find({}, function (err, data) {
        if (err)    return res.status(500).send('Database error.');
        res.status(200).send(data);
    });
}

function updateConfig(req, res) {
    if (req.payload.role !== "admin") {
        res.status(401).json({
            "message" : "UnauthorizedError: User Permission" + req.payload.role
        });
    } else {

    }
}