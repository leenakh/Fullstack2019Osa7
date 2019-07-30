const logger = require('./logger')

const requestLogger = (req, res, next) => {
    logger.info('Method:', req.method)
    logger.info('Path:', req.path)
    logger.info('Body:', req.body)
    logger.info('------')
    next()
}

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'Hakemaasi sivua ei ole olemassa.' })
}

const errorHandler = (error, req, res, next) => {
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return res.status(400).send({ error: JSON.stringify(error) })//'ID invalid.'
    } else if (error.name === 'ValidationError' && error.errors.username !== undefined) {
        return res.status(400).json({ error: error.errors.username.message })
    } else if (error.name === 'ValidationError' && error.errors.name !== undefined) {
        return res.status(400).json({ error: error.errors.name.message })
    } else if (error.name === 'ValidationError' && error.errors.password !== undefined) {
        return res.status(400).json({ error: error.errors.password.message })
    } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'invalid token' })
    }

    logger.error(error.message)

    next(error)
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
}