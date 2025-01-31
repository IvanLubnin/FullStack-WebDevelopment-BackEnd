const express = require('express');
const app = express();
const port = 3004;
const morgan = require('morgan');

app.use(express.json());
app.use(morgan('dev'));

app.listen(port, () =>
{
    console.log(`Server running at http://localhost:${port}/`);
});

const movies =
[
    { id: 1, title: "Inception", director: "Christopher Nolan", year: 2010 },
    { id: 2, title: "The Matrix", director: "The Wachowskis", year: 1999 },
    { id: 3, title: "Parasite", director: "Bong Joon-ho", year: 2019 },
    { id: 4, title: "Tenet", director: "Christopher Nolan", year: 2020 }
];


app.get('/', (req, res) =>
{
    let myhtml = '<h1>Awesome movies!</h1><ul>';
    movies.forEach(movie =>
    {
        myhtml += `<li>Movie: ${movie.title} was directed by ${movie.director} in ${movie.year}</li>`;
    });
    myhtml += '</ul>';
    res.send(myhtml);
});


app.get('/movies', (req, res) =>
{
    const { title, director, year } = req.query;
    let filteredMovies = [...movies];

    console.log("The request came with the parameters:", req.query);
    console.log("Array of films:", filteredMovies);

    if (title)
    {
        filteredMovies = filteredMovies.filter (movie =>
            movie.title.toLowerCase().includes(title.toLowerCase())
        );
        console.log("After filtration by title:", filteredMovies);

    }
    if (director)
    {
        filteredMovies = filteredMovies.filter (movie =>
            movie.director.toLowerCase().includes(director.toLowerCase())
        );
        console.log("After filtration by director:", filteredMovies);

    }
    if (year)
    {
        const yearNum = parseInt(year);
        if (isNaN(yearNum))
        {
            return res.status(400).send('Invalid year parameter');
        }
        filteredMovies = filteredMovies.filter(movie => movie.year === yearNum);
        console.log("After filtration by year:", filteredMovies);
    }

    res.json(filteredMovies);
});


app.get('/movies/:id', (req, res) =>
{
    const movie = movies.find(movie => movie.id === parseInt(req.params.id));
    if (movie)
    {
        res.json(movie);
    }
    else
    {
        res.status(404).send('No movie found');
    }
});


app.post('/movies', (req, res) =>
{
    const { title, director, year } = req.body;

    if (!title || !director || !year || isNaN(year) || year < 1888)
    {
        return res.status(400).send({error:'Invalid data'});
    }

    const newId = movies.length > 0 ? Math.max(...movies.map(m => m.id)) + 1 : 1;
    const newMovie = { id: newId, title, director, year };

    movies.push(newMovie);
    res.status(201).json(newMovie);
});


app.put('/movies/:id', (req, res) =>
{
    const movie = movies.find(movie => movie.id === parseInt(req.params.id));
    if (!movie)
    {
        return res.status(404).send('No movie found');
    }

    const { title, director, year } = req.body;
    if (!title || !director || !year || isNaN(year) || year < 1888)
    {
        return res.status(400).send({error:'Invalid data'});
    }

    movie.title = title;
    movie.director = director;
    movie.year = year;
    res.status(200).json(movie);
});


app.delete('/movies/:id', (req, res) =>
{
    const movieId = parseInt(req.params.id);
    const index = movies.findIndex(movie => movie.id === movieId);

    if (index === -1)
    {
        return res.status(404).send('No movie found');
    }

    movies.splice(index, 1);
    res.sendStatus(204);
});


app.use((req, res) =>
{
    res.status(404).send('Route not found');
});
