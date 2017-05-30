/**
 * Created by tevonial on 5/27/2017.
 */

var jwt = require('express-jwt');


// Middleware parses JWT and adds payload to req object
module.exports = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload'
});
