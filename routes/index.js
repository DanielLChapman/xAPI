const express = require('express');
const router = express.Router();


const courseController = require('../controllers/courseController');

const { catchErrors } = require('../handlers/errorHandlers'); //{} object destructuring.

// Do work here

router.get('/', courseController.homePage );


module.exports = router;
