const express = require('express');
const router = express.Router();


const courseController = require('../controllers/courseController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers'); //{} object destructuring.

// Do work here

router.get('/', courseController.homePage );
router.get('/courses', catchErrors(courseController.getCourses) );
router.get('/add', courseController.addCourse );
router.post('/add', catchErrors(courseController.createCourse) );

//login
router.get('/login', userController.loginForm);
router.post('/login', authController.login);

router.get('/register', userController.registerForm);
router.post('/register', 
	userController.validateRegister,
	userController.register,
	authController.login
);

router.get('/logout', authController.logout);

module.exports = router;
