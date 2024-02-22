const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

let persons = null

const mongoose = require('mongoose')

const password = process.argv[2]

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
const url =
    `mongodb+srv://parfaitandre5:${password}@phonebookv2.ztyamoo.mongodb.net/phoneBook`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('person', personSchema)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})


app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
    res.send(
        '<p>Phonebook has info for ' + persons.length + ' people</p><p>' + new Date() + '</p>')
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(per => {
        res.json(per)
        persons = per
    })
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)

    const person = persons.filter(per => per.id === id)
    person ? res.json(person) : res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)

    persons = persons.filter(per => per.id !== id)
    res.status(204).end()
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.post('/api/persons', (req, res) => {
    const person = req.body

    if (!person.name) {
        return res.status(400).json({ error: 'name missing' })
    }

    if (persons.filter(per => per.name === person.name)[0]) {
        return res.status(400).json({ error: 'name must be unique' })
    }

    person.id = Math.floor(Math.random() * 1000000)
    persons.concat(person)
    res.json(person)

    morgan.token('body', req => JSON.stringify(req.body))
})

const PORT = process.env.PORT || 3005
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

// MONGODB_URI = mongodb+srv://parfaitandre5:7gbk6fyS1IHPGYYb@phonebookv2.ztyamoo.mongodb.net/phoneBook
