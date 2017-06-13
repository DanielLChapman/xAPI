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
		timeStart: req.params.oid2
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


exports.storeQuestionSession = async (req, res, next) => {
	const session = await Session.findOne({_id: storage.getItemSync('session_id') }).exec();
	session.questions.courses.push(req.body.coursesObj);
	await session.save();
	
	if (req.body.correct = true) {
		
	}
	next();
}