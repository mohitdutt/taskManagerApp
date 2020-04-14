const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowerCase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid.')
            }
        }
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minLength: 7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Paaword can not contain "Password".')
            }
        }
    },
    age:{
        type: Number,
        required: true,
        trim: true,
        default: 15,
        validate(value){
            if(value < 0){
                throw new Error('Age must be a positive number.')
            }else if(value < 15){
                throw new Error('Age must be greater than 15.')
            }
        }
    }
})
module.exports = User