const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const courseSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true, //takes out whitespace
		required: 'Please enter a course name!' //Automatically makes it true and passes the string for error messages
	},
	description: {
		type: String,
		trim: true
	},
	video: {
		type: String,
		required: 'Please supply a video url'
	},
	created: {
		type: Date,
		default: Date.now
	},
	questions: [{
		question: {
			type: String,
			default: ' ',
			required: 'Question required'
		},
		answers: [{
			choice: {
				type: String,
				required: 'You must supply a question!'
			},
			isCorrect: {
				type: Boolean,
				required: 'You must mark which one is correct'
			}
		}]
	}]
});

module.exports = mongoose.model('Course', courseSchema);