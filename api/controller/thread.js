/**
 * Created by tevonial on 5/17/2017.
 */

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Thread = mongoose.model('Thread');
var Post = mongoose.model('Post');


router.get('/',     list);
router.get('/:id',  findById);
router.post('/',    create);
router.post('/:id', reply);
module.exports = router;


function list(req, res) {
    Thread.find({})
        .populate({path:'author', select:'name'})
        .exec(function (err, data) {
            if (err)    return res.status(500).send('Database error.');
            res.status(200).send(data);
        });
}

function findById(req, res) {
    Thread.findById(req.params.id)
        .populate({
            path: 'posts',
            populate: {
                path: 'author',
                select: 'name'
            }
        }).exec(function (err, data) {
            if (err)    return res.status(500).send('Database error.');
            res.status(200).send(data);
        });
}

function create(req, res) {
    var thread = new Thread();
    thread.title = req.body.title;
    thread.author = req.body.author;

    var originalPost = new Post();
    originalPost.author = req.body.author;
    originalPost.post = req.body.post;

    thread.save(function (err, data) {
        originalPost.thread = data._id;

        originalPost.save(function (err, data) {
            if (err)    return res.status(500).send('Database error.');

            thread.posts.push(data._id);

            thread.save(function (err) {
                if (err)    return res.status(500).send('Database error.');
                res.status(200).send(data);
            });
        });
    });
}

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
