/**
 * Created by tevonial on 5/27/2017.
 */

var jwt = require('express-jwt');
var secret = require('./secret');


// Middleware parses JWT and adds payload to req object
module.exports = jwt({
    secret: secret,
    userProperty: 'payload'
});
