const mongoose = require('mongoose');
const validator = require('validator');

const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        validate(value){
            if(value.trim().length<20){
                throw new Error('Description must contain atleast 20 letters.')
            }
        }
    },
    completed: {
        type: Boolean,
        default: false
    }
})
module.exports = Task