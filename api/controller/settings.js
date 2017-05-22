/**
 * Created by tevonial on 5/21/2017.
 */

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var User = mongoose.model('User');

//================================================================================
// Retrieve user settings
//================================================================================
router.get('/', function (req, res) {
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

});


//================================================================================
// Update user settings
//================================================================================
router.put('/', function (req, res) {
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

});

module.exports = router;