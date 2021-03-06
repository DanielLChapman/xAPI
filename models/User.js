const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
	email: {
		type: String,
		unique: true,
		lowercase: true,
		trim: true,
		validate: [validator.isEmail, 'Invalid Email Address'],
		required: 'Please Suppy an Email Address, doesnt have to be real, but validation requires something like test@blah.blah'
	},
	resetPasswordToken: String,
	resetPasswordExpires: Date,
	admin: {
		type: Boolean,
		default: false
	}
});

userSchema.plugin(passportLocalMongoose, {usernameField: 'email'} );
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);