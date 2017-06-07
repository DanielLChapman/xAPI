const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const sessionSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: 'You must be logged in'
	},
	course_hover: [{
		type: mongoose.Schema.ObjectId,
		ref: 'Course'
	}],
	course_selection: {
		selection: {
			type: mongoose.Schema.ObjectId,
			ref: 'Course'
		},
		timeEnter: {
			type: Date,
		},
		timeLeave: {
			type: Date,
			default: Date.now
		}
	},
	video: [{
		timeEnterPage: {
			type: Date,
			default: Date.now
		}, 
		timeLeavePage: {
			type: Date,
			default: Date.now
		},
		timeStart: {
			type: Date,
			default: Date.now
		},
		durationWatched: {
			type: Number,
			required: 'Must watch some of the video'
		},
		videoChoice: {
			type: String,
			required: 'Must have watched a video'
		}
	}],
	
	created: {
		type: Date,
		default: Date.now
	},
	style: {
		type: String
	},
	image: {
		type: String,
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
				type: Boolean
			}
		}]
	}]
});

module.exports = mongoose.model('Session', sessionSchema);