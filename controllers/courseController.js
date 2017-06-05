const mongoose = require('mongoose');
const Course = mongoose.model('Course');

exports.homePage = (req, res) => {
	res.render('index', {
		title: 'index'
	});
};