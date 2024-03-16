const express = require('express')
const app = express()
const cors = require('cors')
const personsRouter = require('./controllers/persons')
const { info, error } = require('./utils/logger')
const { MONGODB_URI } = require('./utils/config')
const { errorHandler, unknownEndpoint } = require('./utils/middleware')
const mongoose = require('mongoose')


mongoose.set('strictQuery', false)
info('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
    .then(() => {
        info('connected to', MONGODB_URI)
    })
    .catch(err => {
        error('error connecting to MongoDB:', err.message)
    })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

app.use('/api/persons', personsRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app