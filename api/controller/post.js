/**
 * Created by tevonial on 5/17/2017.
 */

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Thread = mongoose.model('Thread');
var Post = mongoose.model('Post');


router.get('/user/:id', byUser);
router.post('/',        reply)
module.exports = router;


function reply(req, res) {
    Post.create(req.body, function (err, data) {
        if (err)    return res.status(500).send('Database error.');

        var update = {
            $push: {posts: data},
            updated: Date.now()
        };

        Thread.update({_id: data.thread}, update, function (err) {
            if (err)    return res.status(500).send('Database error.');

            res.status(200).send(data);
        });
    });
}

function byUser(req, res) {
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
