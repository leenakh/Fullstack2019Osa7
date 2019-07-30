//const bcrypt = require('bcryptjs')
const commentsRouter = require('express').Router()
const Comment = require('../models/comment')
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const moment = require('moment')

const getTokenFrom = req => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        return authorization.substring(7)
    }
    return null
}

commentsRouter.get('/:id/comments', async (req, res, next) => {
    try {
        const comments = await Comment.find({ blog: req.params.id }).sort('-time').limit(10).populate('blog', { title: 1, author: 1, url: 1, likes: 1, fans: 1, username: 1 }).populate('user', { name: 1, username: 1 })
        res.json(comments.map(comment => comment.toJSON()))
    } catch (exception) {
        next(exception)
    }
})

commentsRouter.post('/:id/comments', async (req, res, next) => {
    const body = req.body
    const token = getTokenFrom(req)
    try {
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!token || !decodedToken.id) {
            return res.status(401).json({ error: 'token missing or invalid' })
        }
        console.log('token', decodedToken)
        const user = await User.findById(decodedToken.id)
        console.log('user', user)
        const blog = await Blog.findById(req.params.id)
        console.log(blog)
        const comment = new Comment({
            content: body.content,
            blog: req.params.id,
            user: user._id,
            time: moment().format('DD.MM.YYYY, HH.mm')
        })
        const savedComment = await comment.save()
        res.json(savedComment.toJSON())
    } catch (exception) {
        next(exception)
    }
})

module.exports = commentsRouter