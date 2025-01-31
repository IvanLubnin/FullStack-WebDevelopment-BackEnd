const Joi = require('joi');
const Movie = require('../models/movie');

const movieSchema = Joi.object({
    title: Joi.string().min(1).required(),
    director: Joi.string().min(1).required(),
    year: Joi.number().integer().min(1900).max(2100).required(),
});

const createMovie = async (req, res) => {
    try
    {
        const { error } = movieSchema.validate(req.body);
        if (error)
        {
            return res.status(400).json({ error: error.details[0].message });
        }

        const movie = new Movie(req.body);
        const savedMovie = await movie.save();
        res.status(201).json(savedMovie);
    }
    catch (error)
    {
        res.status(500).json({ error: 'Failed to create movie' });
    }
};

module.exports =  createMovie;

