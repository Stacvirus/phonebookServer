const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://parfaitandre5:${password}@phonebookv2.ztyamoo.mongodb.net/phoneBook`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    content: 'HTML is easy',
    important: true,
})

process.argv[3] && person.save().then(result => {
    // console.log('person saved!')
    // mongoose.connection.close()
})

Person.find({}).then(result => {
    !process.argv[3] && showAll(result)
    process.argv[3] && showOne(result)
    mongoose.connection.close()
})

function showOne(res) {
    const lastPerson = res[res.length - 1]
    console.log(`Added ${lastPerson.name} ${lastPerson.number} to phonebook`)
}

function showAll(res) {
    console.log('phonebook:')
    res.forEach(per => {
        console.log(per.name, per.number)
    })
}