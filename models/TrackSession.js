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
	video: [{
		selection: {
			type: mongoose.Schema.ObjectId,
			ref: 'Course'
		},
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
	}],
	questions: {
		courses: [{
			selection: {
				type: String
			},
			question: [{
				refQuestion: {
					type: mongoose.Schema.ObjectId,
					ref: 'Course'
				},
				choice: {
					type: String
				},
				answerCorrect: {
					type: Boolean
				}
			}],
		}]
	},
	created: {
		type: Date,
		default: Date.now
	}
});

function autopopulate(next) {
	this.populate('courseHover.selection');
	this.populate('course_selection.selection');
	this.populate('questions.courses.question.refQuestion');
	next();
}

/*
sessionSchema.statics.getVideoWatchCount = function() {
	
	return this.aggregate([
		{
			$unwind: "$video" 
		},
		{
			$group: {
        _id: '$_id',
        count: { $sum: 1 }
			}
		},
		function(err, result) {
			console.log(result);
		}
	]);
}*/

sessionSchema.pre('find', autopopulate);
sessionSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('TrackSession', sessionSchema);