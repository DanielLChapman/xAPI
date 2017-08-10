const mongoose = require('mongoose');
const Course = mongoose.model('Course');
const User = mongoose.model('User');
const Session = mongoose.model('TrackSession');
const promisify = require('es6-promisify');
const storage = require('node-persist');

exports.createSession = async (req, res, next) => {
	req.body.user = req.user._id;
	const session = await (new Session(req.body)).save();
	req.body.session = session;

	storage.setItemSync('session', req.body.session);
	storage.setItemSync('session_id', req.body.session._id);
	next();
};

exports.test = (req, res) => {
	//res.json(storage.getItemSync('session'));
	res.render('videoTest', { title: 'Test'});
}

exports.updateSession = async (req, res, next) => {
	const session = await Session.findOneAndUpdate({ }, req.body, {
		new: true,
	}).exec();

	
	next();
}

exports.apiUpdateHover = async( req, res) => {
	const session = await Session.findOne({_id: storage.getItemSync('session_id') }).exec();
	session.courseHover.selection.push(req.params.oid);
	await session.save();
	
	res.json('Updated');
}

exports.apiUpdateVideo = async (req, res) => {
	const session = await Session.findOne({_id: storage.getItemSync('session_id') }).exec();

	var Video = {
		timeLeavePage: Date.now(),
		timeEnterPage: storage.getItemSync('timeEnterVideo'),
		durationWatched: req.params.oid,
		timeStart: req.params.oid2,
		selection: req.params.courseId
	}

	session.video.push(Video);

	await session.save();

	res.json('Updated');
}

exports.hasStartedSession = (req, res, next) => {
	//check if user is authenticated
	if(storage.getItemSync('session_id')) {
		return next();
	}
	req.flash('error', 'Oops you must start a session ');
	res.redirect('/courses');
};

exports.updateTime = async (req, res, next) => {
	const session = await Session.findOne({_id: storage.getItemSync('session_id') }).exec();
	session.course_selection.timeLeave = Date.now();
	session.course_selection.selection = req.params.id;
	const prom = promisify(storage.setItemSync('timeEnterVideo', Date.now()));
	await prom;
	await session.save();
	next();
}


exports.storeQuestionSession = async (req, res) => {
	const session = await Session.findOne({_id: storage.getItemSync('session_id') }).exec();
	session.questions.courses.push(req.body.coursesObj);
	await session.save();
	
	if (req.body.correct == true) {
		res.locals.messages = req.flash('success', 'Congrats, you got all the questions right');
		res.redirect('/sessionData/'+session._id);
		return;
	}
	
	res.locals.messages = req.flash('error', 'Your answers were wrong');
	res.redirect('/course/'+req.params.id);
}

exports.displaySessionData = async (req, res) => {
	
	if(req.params.id) {
		const session = await Session.findOne({_id: req.params.id  }).exec();
		const user = await User.findOne({ email: req.session.passport.user }).exec();
		if (session.user.toString()==(user._id.toString())) {
			var courseHover = session.courseHover;
			var courseSelection = session.course_selection;
			var videos = session.video;
			var questions = session.questions;	
			res.render('sessionData', {title: 'Session Data', courseHover, courseSelection, videos, questions});
			return;
		}
	}
	res.redirect('/');
	
}

exports.displayAllDataAPI = async (req, res) => {
	const courses = await Course.find({}).exec();
	const courseHoverCount = [];
	const courseSelectionCount = [];
	const courseVideoWatchCount = [];
	const courseAverageWatchDuration = [];
	const courseQuestions = [];
	const courseNumOfWrongQuestions = [];
	
	var duration = 0.0;
	for (var i = 0; i < courses.length; i++) {
		//for frequencies for hover count
		let totalCourseHoversForThisCourse = (await Session.find({"courseHover.selection": courses[i]._id }).count());
		
		courseHoverCount.push({
			course: i,
			amount: totalCourseHoversForThisCourse
		});
		
		courseSelectionCount.push({
			course: i,
			amount: await Session.find({"course_selection.selection": courses[i]._id }).count()
		});
		var sessionsPerCourseId = await Session.find({"video.selection": courses[i]._id }).exec();
		var tempNumOfTriesPerCourseId = 0;
		var tempAverageWatchDuration = 0;
		
		var totalNumOfSessions = sessionsPerCourseId.length;
		
		var numOfTriesOfQuestionsPerCourse = [];
		var countOfWrongForEachIndividualTry = new Array(sessionsPerCourseId[0].questions.courses[0].question.length);
		for (var tempLoop = 0; tempLoop < sessionsPerCourseId[0].questions.courses[0].question.length; tempLoop++) {
			countOfWrongForEachIndividualTry[tempLoop] = 0;
		}
		
		for (var q = 0; q < totalNumOfSessions; q++) {
			tempNumOfTriesPerCourseId += sessionsPerCourseId[q].video.length;
			
			for (var x = 0; x < sessionsPerCourseId[q].video.length; x++) {
				tempAverageWatchDuration += sessionsPerCourseId[q].video[x].durationWatched;
				for (var c = 0; c < sessionsPerCourseId[q].questions.courses[x].question.length; c++) {
					if (!(sessionsPerCourseId[q].questions.courses[x].question[c].answerCorrect)) {
						countOfWrongForEachIndividualTry[c]++;
					}
					
				}
			}
		}
		
		
		tempAverageWatchDuration = parseFloat(Math.round(tempAverageWatchDuration/tempNumOfTriesPerCourseId * 100) / 100).toFixed(2);
		var tempAvgNumOfTriesAtQuestions = parseFloat(Math.round(tempNumOfTriesPerCourseId/totalNumOfSessions * 100) / 100).toFixed(2);
		
		courseVideoWatchCount.push({
			course: i,
			amount: tempNumOfTriesPerCourseId
		});
		courseAverageWatchDuration.push({
			course: i,
			amount: tempAverageWatchDuration
		});
		courseQuestions.push({
			course: i,
			amount: tempAvgNumOfTriesAtQuestions
		});
		courseNumOfWrongQuestions.push({
			course: i,
			amount: countOfWrongForEachIndividualTry
		});
	}
	
	res.json({courseHoverCount: courseHoverCount, courseSelectionCount: courseSelectionCount, courseVideoWatchCount: courseVideoWatchCount, courseAverageWatchDuration: courseAverageWatchDuration, courseQuestions: courseQuestions, courseNumOfWrongQuestions: courseNumOfWrongQuestions});
};

exports.displayAllData = async (req, res) => {
	var user = null;
	var sessions = null;
	if (req.user) {
		user = await User.findOne({ email: req.session.passport.user }).exec();
		sessions = await Session.find({user: user._id}).exec();
	}
	
	const courses = await Course.find({}).exec();
	
	res.render('data', {title: 'Data', user, sessions, courses});
}