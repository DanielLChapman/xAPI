const express = require('express');
const router = express.Router();


const courseController = require('../controllers/courseController');

const { catchErrors } = require('../handlers/errorHandlers'); //{} object destructuring.

// Do work here

router.get('/', courseController.homePage );
router.get('/courses', catchErrors(courseController.getCourses) );
router.get('/add', courseController.addCourse );


module.exports = router;
