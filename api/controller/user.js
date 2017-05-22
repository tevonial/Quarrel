/**
 * Created by tevonial on 5/17/2017.
 */

var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Post = mongoose.model('Post');


router.get('/',         list);
router.get('/:id',      findById);
router.get('/:id/post', findPosts);
module.exports = router;


function list (req, res) {
    //Respond with all items
    User.find({}, function (err, users) {
        if (err)    return res.status(500).send('Database error.');
        res.status(200).send(users);
    });
}

function findById (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err)    return res.status(500).send('Database error.');
        res.status(200).send(user);
    });
}

function findPosts(req, res) {
    Post.find({author: req.params.id})
        .populate({
            path: 'thread',
            select: 'title'
        })
        .exec(function (err, posts) {
            if (err)    return res.status(500).send('Database error.');
            res.status(200).send(posts);
        });
}