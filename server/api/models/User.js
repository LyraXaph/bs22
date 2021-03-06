const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const validator = require('validator');
const md5 = require('md5');

const userSchema = new Schema({
    name: {
        type: String, 
        //required: 'Please supply a name', 
        trim: true,
    }, 
    username: {
        type: String, 
        required: 'Please supply a username', 
        trim: true,
    }, 
    email: {
        type: String, 
        unique: true, 
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Invalid Email Address'],  
        required: 'Please Supply an email address'
    }, 
    lastname: {
        type: String, 
        trim: true
    }, 
    password: {
        type: String,
        required: true
    },
    gym: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gym',
        dafault: '59ece0c7dd8ba60590437e5c'
        //required: 'You must supply a gym!'
    },
    resetPasswordToken: String, 
    resetPasswordExpires: Date, 
    // hearts is an array of ids related to the gym 
    hearts: [
        { type: mongoose.Schema.ObjectId, ref: 'Gym' }
    ],
    climbedBoulders: [
        { type: mongoose.Schema.ObjectId, ref: 'Boulder' }
    ]
}, 
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

userSchema.virtual('gravatar').get(function() {
    const hash = md5(this.email);
    return `https://gravatar.com/avatar/${hash}?s=200`;
})

module.exports = mongoose.model('User', userSchema);
