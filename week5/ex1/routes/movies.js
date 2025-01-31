//this defines all routes to get to the student data

const express = require('express');

//import controllers

const
{
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie,
} = require('../controllers/movieController.js')

const authenticate = require('../middlewares/authenticate');
const validateMovie = require('../middlewares/validateMovie')
const router = express.Router();

//define top level router and pass to controller

router.get('/', authenticate(['admin','regular']), getAllMovies); // now authentication is needed even if getting the students (basic fetch)

router.get('/:id', authenticate(['admin','regular']), getMovieById);

//we use validator middleware whenever creating or updating students
//these operations also need authentication

router.post('/', authenticate(['admin']), validateMovie, createMovie);

router.put('/:id', authenticate(['admin']), validateMovie, updateMovie);

router.delete('/:id', authenticate(['admin']), deleteMovie);

// export this controller to server.js

module.exports = router;
