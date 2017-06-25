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

    user.save(function(err) {
        if (err) return sendError(res, 500, err);
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