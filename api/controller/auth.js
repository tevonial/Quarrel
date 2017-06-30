/**
 * Created by tevonial on 5/20/2017.
 */

var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var passport = require('passport');

var sendError = require('../config/error');

router.post('/register', register);
router.post('/login',    login);
module.exports = router;

function register(req, res) {
    var user = new User();

    user.name = req.body.name;
    user.email = req.body.email;
    user.setPassword(req.body.password);

    // For setup only
    if (req.body.role) {
        User.find({}, function (err, users) {
            if (err) return sendError(res, 500, err.message);
            if (users.length === 0) {
                user.role = req.body.role;
            }

            saveUser(res, user);
        });

    // For all other registrations
    } else {
        saveUser(res, user);
    }
}


function saveUser(res, user) {
    user.save(function(err) {
        if (err) return sendError(res, 500, err.message);
        res.status(200).json({
            "token" : user.generateJwt()
        });
    });
}

function login(req, res) {

    passport.authenticate('local', function(err, user, info){

        // If Passport throws/catches an error
        if (err) {
            res.status(404).json(err);
            return;
        }

        // If a user is found
        if(user){
            res.status(200).json({
                "token" : user.generateJwt()
            });
        } else {
            // If user is not found
            res.status(401).json(info);
        }
    })(req, res);
}