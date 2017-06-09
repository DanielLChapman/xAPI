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