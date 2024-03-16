const personsRouter = require('express').Router()
const Person = require('../models/person')


// personsRouter.get('/', (req, res) => {
//     res.send('<h1>Hello World!</h1>')
// })

personsRouter.get('/info', async (req, res) => {
    const persons = await Person.find({})
    res.send(
        '<p>Phonebook has info for ' + persons.length + ' people</p><p>' + new Date() + '</p>')
})

personsRouter.get('/', (req, res) => {
    Person.find({}).then(per => {
        res.json(per)
    })
})

personsRouter.get('/:id', (req, res, next) => {
    const id = req.params.id

    Person.findById(id)
        .then(result => {
            result ? res.json(result) : res.status(404).end()
        })
        .catch(error => next(error))
})

personsRouter.delete('/:id', (req, res, next) => {
    const id = req.params.id

    Person.findByIdAndDelete(id)
        .then(() => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

// personsRouter.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

personsRouter.post('/', (req, res, next) => {
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

personsRouter.put('/:id', (req, res, next) => {
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

module.exports = personsRouter