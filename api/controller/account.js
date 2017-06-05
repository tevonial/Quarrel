/**
 * Created by tevonial on 5/21/2017.
 */

var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var passport = require('passport');

var jwtParse = require('../config/jwt');


router.get('/', jwtParse, getSettings);
router.put('/', jwtParse, updateSettings);
router.delete('/', jwtParse, deleteAccount);
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
        // Update user model then respond with regenerated token
        User.findByIdAndUpdate(req.payload._id, req.body.settings, {new: true}, function (err, user) {
            if (err)    return res.status(500).send('Database error.');
            res.status(200).json({
                token : user.generateJwt()
            });
        });
    }
}

function deleteAccount(req, res) {
    if (!req.payload._id) {
        res.status(401).json({
            "message" : "UnauthorizedError: private profile"
        });
    } else {
        User.findByIdAndRemove(req.payload._id, function (err) {
            if (err)    return res.status(500).send('Database error.');
            res.status(200).send();
        });
    }
}