//This defines movie data schema
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title:
    {
        type: String, required: true
    },
    year:
    {
        type: Number,
        required: true,
    },
    director:
    {
        type: String, required: true
    },
});
const Movie = mongoose.model('Movie', movieSchema, 'Movie Demo colection');

module.exports = Movie;