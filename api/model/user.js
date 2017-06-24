/**
 * Created by tevonial on 5/17/2017.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: String,
    name: {
        first: String,
        last: String
    },
    role: {type: String, default: 'reg'},
    password: String
    // hash: Number,
    // salt: Number
});


//================================================================================
// Authentication and JSON web tokens
//================================================================================

var crypto = require('crypto');
var jwt = require('jsonwebtoken');

userSchema.methods.setPassword = function(password){
    // this.salt = crypto.randomBytes(16).toString('hex');
    // this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    this.password = password;
};

userSchema.methods.validPassword = function(password) {
    // var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    // return this.hash === hash;
    return this.password === password;
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
    }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

mongoose.model('User', userSchema);