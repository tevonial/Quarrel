/**
 * Created by tevonial on 5/17/2017.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: {type: String, unique: true},
    name: {
        first: {type: String, required: true},
        last: {type: String, required: true}
    },
    role: {type: String, default: 'reg'},
    hash: String,
    salt: String
});


//================================================================================
// Authentication and JSON web tokens
//================================================================================

var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../config/secret');

function md5(string) {
    return crypto.createHash('md5').update(string).digest('hex');
}

userSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = md5(password + this.salt);
};

userSchema.methods.validPassword = function(password) {
    return this.hash === md5(password + this.salt);
};

userSchema.methods.generateJwt = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        role: this.role,
        exp: parseInt(expiry.getTime() / 1000)
    }, secret);
};

mongoose.model('User', userSchema);