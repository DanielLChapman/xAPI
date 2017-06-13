const express = require('express');
const router = express.Router();


const courseController = require('../controllers/courseController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const sessionController = require('../controllers/trackSessionController');
const { catchErrors } = require('../handlers/errorHandlers'); //{} object destructuring.

// Do work here

router.get('/', courseController.homePage );
router.get('/add', 
	authController.isLoggedIn,	
	courseController.addCourse );
router.post('/add', 
	authController.isLoggedIn,
	catchErrors(courseController.createCourse) );

router.get('/test', sessionController.test);

router.get('/courses', 
	authController.isLoggedIn,
	catchErrors(sessionController.createSession),				 
	catchErrors(courseController.getCourses) );

router.get('/course/:id', 
	authController.isLoggedIn,
	sessionController.hasStartedSession,
	catchErrors(sessionController.updateTime),
	catchErrors(courseController.getVideo) 
	);

router.get('/course/:id/questions', 
	authController.isLoggedIn,
	sessionController.hasStartedSession,
	catchErrors(courseController.getQuestions)
	);
router.post('/course/:id/questions/answers', 
	authController.isLoggedIn,
	sessionController.hasStartedSession,
	catchErrors(courseController.checkAnswers),
	catchErrors(sessionController.storeQuestionSession),
	courseController.nextStep
	);


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
router.post('/api/apiUpdateHover/:switch/:oid/', sessionController.apiUpdateHover);

//video
router.post('/api/apiUpdateVideo/:switch/:oid/:oid2', 
		sessionController.apiUpdateVideo
	);

router.get('/logout', authController.logout);

module.exports = router;
