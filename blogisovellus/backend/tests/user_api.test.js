const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const initialUsers = [
    {
        username: 'testiheikki',
        name: 'Heikki',
        password: 'testi'

    },
    {
        username: 'testihannu',
        name: 'Hannu',
        password: 'testi',
    }
]

beforeEach(async () => {
    await User.deleteMany({})
    let userObject = new User(initialUsers[0])
    await userObject.save()
    let userObject2 = new User(initialUsers[1])
    await userObject2.save()
})

const api = supertest(app)

test('new user can be added', async () => {
    const user = {
        username: 'testi',
        name: 'Testi',
        password: 'testi'
    }
    await api
        .post('/api/users')
        .send(user)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const result = await api.get('/api/users')
    expect(result.body.length).toBe(initialUsers.length + 1)

    const usernames = result.body.map(u => u.username)
    expect(usernames).toContain(user.username)
})

test('user cannot be added without valid username', async () => {
    const user = {
        name: 'Testi',
        password: 'testi'
    }
    const anotherUser = {
        username: 't',
        name: 'Testi',
        password: 'testi'
    }
    await api
        .post('/api/users')
        .send(user)
        .expect(400)
        .expect('{"error":"Path `username` is required."}')

    await api
        .post('/api/users')
        .send(anotherUser)
        .expect(400)
        .expect('{"error":"Path `username` (`t`) is shorter than the minimum allowed length (3)."}')

    const response = await api.get('/api/users')
    expect(response.body.length).toBe(initialUsers.length)
})

test('user cannot be added without valid name', async () => {
    const user = {
        username: 'testi',
        password: 'testi'
    }
    await api
        .post('/api/users')
        .send(user)
        .expect(400)

    const response = await api.get('/api/users')
    expect(response.body.length).toBe(initialUsers.length)
})

test('user cannot be added without valid password', async () => {
    const user = {
        username: 'testi',
        name: 'Testi'
    }
    const anotherUser = {
        username: 'testi',
        name: 'Testi',
        password: 't'
    }
    await api
        .post('/api/users')
        .send(user)
        .expect(400)
        .expect('{"error":"Syötä salasana."}')

    await api
        .post('/api/users')
        .send(anotherUser)
        .expect(400)
        .expect('{"error":"Salasanan täytyy olla vähintään 3 merkin pituinen."}')

    const response = await api.get('/api/users')
    expect(response.body.length).toBe(initialUsers.length)
})

test('user cannot be added if username already in database', async () => {
    const user = {
        username: 'testiheikki',
        name: 'Hessu',
        password: 'hessu'
    }

    await api
        .post('/api/users')
        .send(user)
        .expect(400)
        .expect('{"error":"Error, expected `username` to be unique. Value: `testiheikki`"}')

    const response = await api.get('/api/users')
    expect(response.body.length).toBe(initialUsers.length)
})

afterAll(() => { mongoose.connection.close() })