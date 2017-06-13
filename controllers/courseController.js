const mongoose = require('mongoose');
const Course = mongoose.model('Course');

exports.homePage = (req, res) => {

	res.render('index', {
		title: 'index',
	});
};

exports.getCourses = async (req, res) => {
	const courses = await Course.find();
	const timeEnter = new Date();
	
	res.render('courses', { title: 'Courses', courses, time: timeEnter.toISOString()});
};

exports.addCourse = (req, res) => {
	
	res.render('add', { title: 'Add Course'});
};

exports.createCourse = async (req, res) => {
	const course = await (new Course(req.body)).save();
	req.flash('success', `Successfully Created ${course.name}.` );
	res.redirect('/');
}

exports.getVideo = async (req, res) => {
	const course = await Course.findOne({_id: req.params.id }).exec();
	res.render('video', { title: 'Video Page', course});
}

exports.getQuestions = async (req, res) => {
	const course = await Course.findOne({_id: req.params.id }).exec();
	res.render('questions', { title: 'Questions Page', course});
}

exports.checkAnswers = async (req, res, next) => {
	const course = await Course.findOne({_id: req.params.id }).exec();
	if (req.body.questions.length != course.questions.length) {
		res.locals.messages = req.flash('error', 'Must submit an aswer for all questions');
		res.redirect('/course/'+req.params.id+'/questions');
		return;
	} 
	
	const ans = [];
	const questionIds = [];
	const questions = [];
	var correct = 0;
	
	for (i=0; i < course.questions.length; i++) {
		const tempCourse = course.questions[i].answers; 
		questionIds.push(course.questions[i]._id);
		for (q = 0; q < tempCourse.length; q++) {
			if (tempCourse[q].isCorrect) {
				ans.push(tempCourse[q].choice);
			}
		}
	}
	
	var coursesObj = {
			selection: course.name,
			question: []
	};

	for(i = 0; i < req.body.questions.length; i++) {
		var question = {
			refQuestion: questionIds[i],
			choice: req.body.questions[i].question,
			answerCorrect: false	
		};
		if( req.body.questions[i].question == ans[i] ) {
			correct++;
			question.answerCorrect = true;
		}
		coursesObj.question.push(question);
	}
	req.body.coursesObj = coursesObj;
	
	if (correct == course.questions.length) {
		req.body.correct = true;
	}
	else { 
		req.body.corect = false; 
	}
	next();
}

exports.nextStep = (req, res) => {
	res.json('it works');
}