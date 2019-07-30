const config = require('./utils/config')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const commentsRouter = require('./controllers/comments')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
const cors = require('cors')
const logger = require('./utils/logger')

app.use(cors())

const mongoUrl = config.MONGODB_URI

logger.info('Yhdistetään osoitteeseen', mongoUrl)

mongoose.connect(mongoUrl, { useNewUrlParser: true })
    .then(() => {
        logger.info('Yhdistettiin MongoDB:hen.')
    })
    .catch((error) => {
        logger.error('MongoDB:hen yhdistettäessä tapahtui virhe:', error.message)
    })

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(middleware.requestLogger)

if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/blogs', commentsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
