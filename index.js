const express = require('express')
const app = express()
// var morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const Person = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))


function errorHandler(error, req, res, next) {
    console.log(error.name, error.message)

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


app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/info', async (req, res) => {
    const persons = await Person.find({})
    res.send(
        '<p>Phonebook has info for ' + persons.length + ' people</p><p>' + new Date() + '</p>')
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(per => {
        res.json(per)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id

    Person.findById(id)
        .then(result => {
            result ? res.json(result) : res.status(404).end()
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id

    Person.findByIdAndDelete(id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    if (!body.name) {
        return res.status(400).json({ error: 'name missing' })
    }

    const person = Person({
        name: body.name,
        number: body.number,
    })

    person.save()
        .then(result => {
            res.json(result)
        })
        .catch(error => next(error))

    // morgan.token('body', req => JSON.stringify(req.body))
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true })
        .then(updatedNote => {
            res.json(updatedNote)
        })
        .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

