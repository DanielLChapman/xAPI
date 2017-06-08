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
	//await means we wont move on until save has happened
	//req.flash('success', `Successfully Created A New Tracking Session.` );
	storage.setItemSync('session', req.body.session);
	storage.setItemSync('session_id', req.body.session._id);
	next();
	//async needs to be wrapped in a try catch or an error handling
};

exports.test = (req, res) => {
	res.json(storage.getItemSync('session'));
}

exports.updateSession = async (req, res, next) => {
	const session = await Session.findOneAndUpdate({ }, req.body, {
		new: true,
	}).exec();

	
	next();
}

exports.apiUpdateSession = async (req, res) => {
	const session = await Session.findOne({_id: storage.getItemSync('session_id') }).exec();
	switch(req.params.switch) {
		case 'hover': 
			session.courseHover.selection.push(req.params.oid);
			break;
	}
	
	await session.save();
	
	console.log(session);
	res.json('Updated');
}