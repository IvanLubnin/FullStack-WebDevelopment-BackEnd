const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const movies =
[
    { id: 1, title: "Inception", director: "Christopher Nolan", year: 2010 },
    { id: 2, title: "The Matrix", director: "The Wachowskis", year: 1999 },
    { id: 3, title: "Parasite", director: "Bong Joon-ho", year: 2019 }
];

app.get('/', (req, res) =>
{
    let movieList = '<h1>Movie List</h1><ul>';
    movies.forEach(movie =>
    {
        movieList += `<li>${movie.title} (${movie.year}) - Directed by ${movie.director}</li>`;
    });
    movieList += '</ul>';
    res.send(movieList);
});

app.get('/movies', (req, res) =>
{
    res.json(movies);
});

app.post('/movies', (req, res) =>
{
    const newMovie =
    {
        id: movies.length + 1,
        title: req.body.title,
        director: req.body.director,
        year: req.body.year
    };
    movies.push(newMovie);
    res.status(201).json(newMovie);
});

app.get('/movies/:id', (req, res) =>
{
    const movie = movies.find(m => m.id === parseInt(req.params.id));
    if (!movie) return res.status(404).send('Movie not found');
    res.json(movie);
});

app.delete('/movies/:id', (req, res) => {
    const movieId = parseInt(req.params.id);
    const index = movies.findIndex(movie => movie.id === movieId);
    if (index !== -1) {
        movies.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Movie not found'); 
    }
});


app.listen(PORT, () =>
{
    console.log(`Server is running on http://localhost:${PORT}`);
});