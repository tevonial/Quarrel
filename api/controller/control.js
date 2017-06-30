/**
 * Created by tevonial on 6/22/2017.
 */

var router = require('express').Router();
var mongoose = require('mongoose');
var Control = mongoose.model('Control');
var User = mongoose.model('User');

var jwtParse = require('../config/jwt');

router.get('/',     getConfig);
router.put('/', jwtParse, updateConfig);

module.exports = router;

function getConfig(req, res) {

    Control.find({}).exec(function (err, data) {
        if (err)    return res.status(500).json({'message':'Database error.'});

        User.find({role:'mod'}).select('name').exec(function (err, mods) {
            data.push({
                name: 'mods',
                value: mods
            });

            res.status(200).send(data);
        });

    });

}

function updateConfig(req, res) {
    if (req.payload.role !== "admin") {
        res.status(401).json({
            "message" : "UnauthorizedError: User Permission"
        });
    } else {

        req.body.forEach(function (x) {
            Control.update({name: x.name}, {$set: {value: x.value}}, {upsert: true}, function (err, data) {

            });
        });

        res.status(200).send();

    }
}