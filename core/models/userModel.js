const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'Firstname is required'],
        trim: true
    },

    lastname: {
        type: String,
        required: [true, 'Firstname is required'],
        trim: true
    },

    middlename: {
        type: String,
        required: [true, 'Firstname is required'],
        trim: true
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email already exists'],
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please, provide a valid Email address']
    },

    classroom: [{
        type: mongoose.Schema.ObjectId,
        default: null,
        ref: 'ClassRoom'
    }],

    phone: {
        type: Number,
        defualt: 0,
        required: true
    },

    role: {
        type: String,
        enum: ['user', 'instructor', 'admin'],
        default: 'user'
    },

    password: {
        type: String,
        required: [true, 'Please, provide a strong password'],
        minlength: 8,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Your password should not contain the word "password"')
            }
        },
        select: false
    },

    passwordConfirm: {
        type: String,
        required: [true, 'You must confirm your password'],
        validate: {
            //This only works on CREAT and SAVE!!!
            validator: function(el){
                return el === this.password;
            },
            
            message: 'Passwords must be the same'
        }
    },

    photo: {
        type: String,
        default: 'default.jpg'
    },

    tokens: [{
        token: {
            type: String,
        }
    }],

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

    active: {
        type: Boolean,
        default: true,
        select: false
    }
})


//Get public profile only
userSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.active;

    return userObject;
}

//Generate a user token
userSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({_id: user._id.toString() }, process.env.JWT, {
        expiresIn: process.env.JWT_EXPR
    });

    user.tokens = user.tokens.concat({token});

    await user.save({validateBeforeSave: false});
    return token;
}

//login in a user
userSchema.statics.findByCredentials = async (email, password) => {
    const user = User.findOne({email}).select('+password');

    return user;
}


userSchema.pre('save', async function(next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();
  
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
  
    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});
  
userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
}); 

userSchema.pre(/^find/, function(next) {
    // this points to the current query
    this.find({ active: { $ne: false } });
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt( this.passwordChangedAt.getTime() / 1000, 10 );

        return JWTTimestamp < changedTimestamp;
    }
    // False means NOT changed
    return false;
};

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    console.log({ resetToken }, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;