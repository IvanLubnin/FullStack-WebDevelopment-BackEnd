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

const validateMovie = require('../middlewares/validateMovie')
const router = express.Router();

//define top level router and pass to controller

router.get('/', getAllMovies);

router.get('/:id', getMovieById);

router.post('/', validateMovie, createMovie);

router.put('/:id', validateMovie, updateMovie);

router.delete('/:id', deleteMovie);

// export this controller to server.js

module.exports = router;
