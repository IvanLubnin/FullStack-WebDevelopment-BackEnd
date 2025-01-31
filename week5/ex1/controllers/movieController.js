const Movie = require('../models/movie');

// GET /movies
const getAllMovies = async (req, res) =>
{
    try
    {
        const query = {};
        if (req.query.title) query.title = req.query.title;
        if (req.query.minYear) query.year = { $gte: parseInt(req.query.minYear) };

        const movies = await Movie.find(query);
        res.json(movies);
    }
    catch (error)
    {
        console.error('Error fetching movies:', error);
        res.status(500).json({ error: 'Error fetching movies' });
    }
};

// GET /movies/id
const getMovieById = async (req, res) =>
{
    try {
        const { id } = req.params;
        const movie = await Movie.findById(id);

        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.json(movie);
    }
    catch (error)
    {
        console.error('Error fetching movie:', error);
        res.status(500).json({ error: 'Error fetching movie' });
    }
};

// POST /movies
const createMovie = async (req, res) =>
{
    try
    {
        const movie = req.body;

        if (!movie.title || !movie.director || !movie.year)
        {
            return res.status(400).json({ error: 'Missing required fields: title, director, or year' });
        }

        const newMovie = new Movie(movie);
        await newMovie.save();

        res.status(201).json(newMovie); // Return the newly created movie
    }
    catch (error)
    {
        console.error('Error adding movie:', error);
        res.status(500).json({ error: 'Error adding movie' });
    }
};

// PUT /movies/id
const updateMovie = async (req, res) =>
    {
    try
    {
        const { id } = req.params;
        const updatedMovie = req.body;

        if (!updatedMovie.title || !updatedMovie.director || !updatedMovie.year)
        {
            return res.status(400).json({ error: 'Missing required fields: title, director, or year' });
        }

        // Use Mongoose method to update the movie
        const result = await Movie.findByIdAndUpdate(
            id,
            updatedMovie,
            { new: true, runValidators: true } // Return the updated movie and run validation
        );

        if (!result)
        {
            return res.status(404).json({ error: 'Movie not found' });
        }

        res.status(200).json({ message: 'Movie updated successfully', movie: result });
    }
    catch (error)
    {
        console.error('Error updating movie:', error);
        res.status(500).json({ error: 'Error updating movie' });
    }
};

// DELETE /movies/id
const deleteMovie = async (req, res) =>
{
    try
    {
        const { id } = req.params;

        // Use Mongoose method to delete the movie
        const deletedMovie = await Movie.findByIdAndDelete(id);

        if (!deletedMovie)
        {
            return res.status(404).json({ error: 'Movie not found' });
        }

        res.json({ message: "Movie deleted" });
    }
    catch (error)
    {
        console.error('Error deleting movie:', error);
        res.status(500).json({ error: "Error deleting movie" });
    }
};

module.exports =
{
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie
};
