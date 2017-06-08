const express = require('express');
const router = express.Router();


const courseController = require('../controllers/courseController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const sessionController = require('../controllers/trackSessionController');
const { catchErrors } = require('../handlers/errorHandlers'); //{} object destructuring.

// Do work here

router.get('/', courseController.homePage );
router.get('/courses', 
	catchErrors(sessionController.createSession),				 
	catchErrors(courseController.getCourses) );
router.get('/add', 
	authController.isLoggedIn,	
	courseController.addCourse );
router.post('/add', 
	authController.isLoggedIn,
	catchErrors(courseController.createCourse) );

router.get('/test', sessionController.test);

//login
router.get('/login', userController.loginForm);
router.post('/login', authController.login);

router.get('/register', userController.registerForm);
router.post('/register', 
	userController.validateRegister,
	userController.register,
	authController.login
);

//api
//hover
router.post('/api/apiUpdateSession/:switch/:oid', sessionController.apiUpdateSession);

router.get('/logout', authController.logout);

module.exports = router;
