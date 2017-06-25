/**
 * Created by tevonial on 5/17/2017.
 */

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var jwtParse = require('../config/jwt');
var sendError = require('../config/error');

var Thread = mongoose.model('Thread');
var Post = mongoose.model('Post');


router.get('/',     list);
router.get('/:id',  findById);
router.post('/',    jwtParse, create);
router.post('/:id', jwtParse, reply);
router.put('/:id',  jwtParse, renameThread);
router.put('/post/:id',    jwtParse, editPost);
router.delete('/:id',      jwtParse, deleteThread);
router.delete('/post/:id', jwtParse, deletePost);
module.exports = router;


function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

function list(req, res) {
    Thread.find({})
        .sort('-updated')
        .populate({path:'author', select:'name'})
        .exec(function (err, data) {
            if (err)    return sendError(res, 500, 'Database error.');
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
            if (err)    return sendError(res, 500, 'Database error.');
            res.status(200).send(data);
        });
}

function create(req, res) {
    if (isBlank(req.body.post))    return sendError(res, 400, 'Invalid post.');

    var thread = new Thread();
    thread.title = req.body.title;
    thread.author = req.payload._id;

    var originalPost = new Post();
    originalPost.author = req.payload._id;
    originalPost.post = req.body.post;

    thread.save(function (err, data) {
        originalPost.thread = data._id;

        originalPost.save(function (err, data) {
            if (err)    return sendError(res, 500, 'Database error.');

            thread.posts.push(data._id);

            thread.save(function (err) {
                if (err)    return sendError(res, 500, 'Database error.');
                res.status(200).send(data);
            });
        });
    });
}

function reply(req, res) {
    if (isBlank(req.body.post) || req.params.id !== req.body.thread)
        return sendError(res, 400, 'Invalid post.');

    req.body.author = req.payload._id;

    Post.create(req.body, function (err, data) {
        if (err)    return sendError(res, 500, 'Database error.');

        var update = {
            $push: {posts: data},
            updated: Date.now()
        };

        Thread.update({_id: data.thread}, update, function (err) {
            if (err)    return sendError(res, 500, 'Database error.');

            res.status(200).send(data);
        });
    });
}

function deleteThread(req, res) {
    Thread.findById(req.params.id, function (err, thread) {
        if (err)    return sendError(res, 500, 'Database error.');

        if (req.payload._id != thread.author) {
            return sendError(res, 401, "UnauthorizedError: Must have ownership of thread");
        }

        Post.remove({_id: {$in: thread.posts}}, function (err) {
            if (err)    return res.status(500).send('Database error.');

            thread.remove();
            res.status(200).send();
        });
    });
}

function renameThread(req, res) {
    if (isBlank(req.body.title))    return sendError(res, 400, 'Invalid title.');

    Thread.findById(req.params.id, function (err, thread) {
        if (err)    return sendError(res, 500, 'Database error.');

        if (req.payload._id != thread.author) {
            return sendError(res, 401, "UnauthorizedError: Must have ownership of thread");
        }

        thread.title = req.body.title;
        thread.save();

        res.status(200).send();
    });
}

function deletePost(req, res) {
    Post.findById(req.params.id, function (err, post) {
        if (err)    return sendError(res, 500, 'Database error.');

        if (req.payload._id != post.author) {
            return sendError(res, 401, "UnauthorizedError: Must have ownership of post");
        }

        Thread.findByIdAndUpdate(post.thread, {$pull: {posts: req.params.id}}, function (err) {
            if (err)    return sendError(res, 500, 'Database error.');

            post.remove();
            res.status(200).send();
        });
    });
}

function editPost(req, res) {
    if (isBlank(req.body.post))    return sendError(res, 500, 'Database error.');

    Post.findById(req.params.id, function (err, post) {
        if (err)    return sendError(res, 500, 'Database error.');

        if (req.payload._id != post.author) {
            return sendError(res, 401, "UnauthorizedError: Must have ownership of post");
        }

        post.post = req.body.post;
        post.save();

        res.status(200).send();
    })
}