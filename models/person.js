const mongoose = require('mongoose')
require('dotenv').config()
// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)
    .then(res => {
        console.log('connected to Mongod')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        validate: {
            validator: (v) => /\d{2,3}-\d{7,}/.test(v),
            message: (props) => `${props.value} is not a valid phone number`,
        },
        require: [true, 'User phone number required'],
    },
})

const Person = mongoose.model('person', personSchema)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = Person