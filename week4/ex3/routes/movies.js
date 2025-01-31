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

router.get('/', getAllMovies);

router.get('/:id', getMovieById);

router.post('/', authenticate, validateMovie, createMovie);

router.put('/:id', authenticate, validateMovie, updateMovie);

router.delete('/:id', authenticate, deleteMovie);

// export this controller to server.js

module.exports = router;
