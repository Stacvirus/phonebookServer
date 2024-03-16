const logger = require('../utils/logger')

function errorHandler(error, req, res, next) {
    logger.error(error.name, error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformed id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).send({ error: error.message })
    }

    next(error)
}

function unknownEndpoint(req, res) {
    res.status(404).send({ error: 'unknown endpoint' })
}

module.exports = { errorHandler, unknownEndpoint }