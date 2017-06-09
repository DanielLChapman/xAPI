const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const sessionSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: 'You must be logged in'
	},
	courseHover: {
		timeEnter: {
			type: Date,
			default: Date.now
		},
		selection: [{
			type: mongoose.Schema.ObjectId,
			ref: 'Course'
		}]
	},
	course_selection: {
		selection: {
			type: mongoose.Schema.ObjectId,
			ref: 'Course'
		},
		timeEnter: {
			type: Date,
			default: Date.now
		},
		timeLeave: {
			type: Date,
			default: Date.now
		}
	},
	video: {
		timeEnterPage: {
			type: Date,
			default: Date.now
		}, 
		timeLeavePage: {
			type: Date,
		},
		timeStart: {
			type: Date,
		},
		durationWatched: {
			type: Number
		}
	},
	questions: [{
		question: [{
			hovered: [{
				type: mongoose.Schema.ObjectId,
				ref: 'Course'
			}],
			answer: {
				type: mongoose.Schema.ObjectId,
				ref: 'Course'
			},
			answerCorrect: {
				type: Boolean
			}
		}],
	}],
	created: {
		type: Date,
		default: Date.now
	}
});

function autopopulate(next) {
	this.populate('courseHover.selection');
	next();
}

sessionSchema.pre('find', autopopulate);
sessionSchema.pre('findOne', autopopulate);
module.exports = mongoose.model('TrackSession', sessionSchema);