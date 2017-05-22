/**
 * Created by tevonial on 5/21/2017.
 */

var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var passport = require('passport');
var jwt = require('express-jwt');

// Middleware parses JWT and adds payload to req object
var jwtParse = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload'
});


router.get('/', jwtParse, getSettings);
router.put('/', jwtParse, updateSettings);
module.exports = router;


function getSettings(req, res) {
    if (!req.payload._id) {
        res.status(401).json({
            "message" : "UnauthorizedError: private profile"
        });
    } else {
        User.findById(req.payload._id, function (err, user) {
            if (err)    return res.status(500).send('Database error.');
            res.status(200).json(user);
        });
    }
}

function updateSettings(req, res) {
    if (!req.payload._id) {
        res.status(401).json({
            "message" : "UnauthorizedError: private profile"
        });
    } else {
        User.update({_id: req.payload._id}, req.body.settings, function (err) {
            if (err)    return res.status(500).send('Database error.');
            res.status(200).send();
        });
    }
}