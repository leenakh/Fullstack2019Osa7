const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
require('../models/comment')

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({})
        .populate('user', { username: 1, name: 1, blogs: 1, likedBlogs: 1 })
        .populate('comments', { content: 1 })
    res.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.get('/:id', async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id)
        if (blog) {
            const returnedBlog = await Blog.findById(blog._id)
                .populate('user', { username: 1, name: 1, blogs: 1, likedBlogs: 1 })
                .populate('comments', { content: 1 })
            res.json(returnedBlog.toJSON())
        } else {
            res.status(404).end()
        }
    } catch (exception) {
        next(exception)
    }
})

const getTokenFrom = req => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        return authorization.substring(7)
    }
    return null
}

blogsRouter.post('/', async (req, res, next) => {
    const body = req.body
    const token = getTokenFrom(req)
    try {
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!token || !decodedToken.id) {
            return res.status(401).json({ error: 'token missing or invalid' })
        }

        const user = await User.findById(decodedToken.id)

        if (body.title === undefined || body.url === undefined) {
            res.status(400).end()
        } else {
            const blog = new Blog({
                title: body.title,
                author: body.author,
                url: body.url,
                likes: body.likes === undefined ? 0 : body.likes,
                user: user._id,
                username: user.username,
                fans: body.fans === undefined ? [] : body.fans
            })


            const savedBlog = await blog.save()
            user.blogs = user.blogs.concat(savedBlog._id)
            await User.findByIdAndUpdate(user._id, user, { new: true })
            const returnedBlog = await Blog.findById(savedBlog._id)
                .populate('user', { username: 1, name: 1, blogs: 1, likedBlogs: 1 })
            res.json(returnedBlog.toJSON())
        }
    } catch (exception) {
        next(exception)
    }

})

blogsRouter.delete('/:id', async (req, res, next) => {
    const token = getTokenFrom(req)
    try {
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!token || !decodedToken.id) {
            return res.status(401).json({ error: 'token missing or invalid' })
        }
        const blog = await Blog.findById(req.params.id)
        console.log(blog)
        if (blog.user._id.toString() === decodedToken.id) {
            await Blog.findByIdAndRemove(req.params.id)
            res.status(204).end()
        } else {
            return res.status(401).json({ error: 'Unauthorized.' })
        }
    } catch (exception) {
        next(exception)
    }
})

blogsRouter.put('/:id', async (req, res, next) => {
    const body = req.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        username: body.username,
        fans: body.fans
    }
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true })
            .populate('user', { username: 1, name: 1, blogs: 1, likedBlogs: 1 })
        res.json(updatedBlog.toJSON())
    } catch (exception) {
        next(exception)
    }

})

module.exports = blogsRouter