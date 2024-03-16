const mongoose = require('mongoose')
// DO NOT SAVE YOUR PASSWORD TO GITHUB!!


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


personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('person', personSchema)