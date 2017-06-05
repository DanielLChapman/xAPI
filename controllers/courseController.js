const mongoose = require('mongoose');
const Course = mongoose.model('Course');

exports.homePage = (req, res) => {
	res.render('index', {
		title: 'index'
	});
};

exports.getCourses = async (req, res) => {
	const courses = await Course.find();
	
	res.render('courses', { title: 'Courses', courses});
};

exports.addCourse = (req, res) => {
	
	res.render('add', { title: 'Add Course'});
};

exports.createCourse = async (req, res) => {
	const course = await (new Course(req.body)).save();
	req.flash('success', `Successfully Created ${course.name}. Care to leave a review?` );
	res.json(course);
}