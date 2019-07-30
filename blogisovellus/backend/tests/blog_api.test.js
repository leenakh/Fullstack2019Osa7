const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'Testi',
        author: 'Testaaja',
        url: 'http://testi.fi',
        likes: 1,
        id: 1
    },
    {
        title: 'Toka testi',
        author: 'Toka Testaaja',
        url: 'http://tokatesti.fi',
        likes: 2
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    let blogObject2 = new Blog(initialBlogs[1])
    await blogObject2.save()
})

const api = supertest(app)

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('right amount of blogs gets returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body.length).toBe(initialBlogs.length)
})

test('returned blogs contain specific blog', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(response => response.title)
    expect(titles).toContainEqual('Testi')
})

test('field id is named id', async () => {
    const response = await api.get('/api/blogs')
    const blog = response.body[0]
    expect(Object.keys(blog)).toContainEqual('id')
    //expect(blog.id).toBeDefined()
})

test('blog can be added', async () => {
    const blog = {
        title: 'Kolmas testi',
        author: 'Kolmas Testaaja',
        url: 'http://kolmastesti.fi',
        likes: 3
    }
    await api
        .post('/api/blogs')
        .send(blog)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    const titles = response.body.map(response => response.title)
    expect(response.body.length).toBe(initialBlogs.length + 1)
    expect(titles).toContainEqual('Kolmas testi')
})

test('blog cannot be added without title and url', async () => {
    const blog = {
        author: 'Tyhjä Testaaja',
        likes: 0
    }
    await api
        .post('/api/blogs')
        .send(blog)
        .expect(400)
    const response = await api.get('/api/blogs')
    expect(response.body.length).toBe(initialBlogs.length)
})

test('if blog added without likes, likes set to zero', async () => {
    const blog = {
        title: 'Neljäs testi',
        author: 'Neljäs Testaaja',
        url: 'http://neljästesti.fi'
    }
    const result = await api
        .post('/api/blogs')
        .send(blog)
        .expect(200)
    expect(result.body.likes).toBe(0)
})

afterAll(() => {
    mongoose.connection.close()
})