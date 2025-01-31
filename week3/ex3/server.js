const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
const port = 3004;

const uri = "mongodb+srv://lubninivan05:3cPT3gSM0WA88qHe@cluster1.yp6zm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";
const client = new MongoClient(uri,
{
    serverApi:
    {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


let moviesCollection;

async function run()
{
    try
    {
        await client.connect();
        const database = client.db("moviesDB");
        moviesCollection = database.collection("movies");
        console.log("Connected to MongoDB!");

        app.listen(port, () =>
        {
            console.log(`Server running at http://localhost:${port}/`);
        });

    }
    catch (error)
    {
        console.error("Error:", error);
        process.exit(1);
    }
}

app.use(express.json());

app.get('/movies', async (req, res) =>
{
    try
    {
        const movies = await moviesCollection.find().toArray();
        res.json(movies);
    }
    catch (error)
    {
        res.status(500).json({ error: "Error" });
    }
});

app.get('/movies/:id', async (req, res) =>
{
    const { id } = req.params;
    try
    {
        const movie = await moviesCollection.findOne({ _id: new ObjectId(id) });
        if (movie)
        {
            res.json(movie);
        }
        else
        {
            res.status(404).json({ error: "Movie not found" });
        }
    } catch (error)
    {
        res.status(500).json({ error: "Error" });
    }
});

app.post('/movies', async (req, res) =>
{
    const newMovie = req.body;
    try
    {
        const result = await moviesCollection.insertOne(newMovie);
        res.status(201).json({ message: "Movie added", insertedId: result.insertedId });
    }
    catch (error)
    {
        res.status(500).json({ error: "Error adding movie" });
    }
});


app.put('/movies/:id', async (req, res) =>
{
    const { id } = req.params;
    const updatedMovie = req.body;
    try
    {
        const result = await moviesCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedMovie }
        );
        if (result.matchedCount > 0)
        {
            res.json({ message: "Movie updated" });
        }
        else
        {
            res.status(404).json({ error: "Movie not found" });
        }
    }
    catch (error)
    {
        res.status(500).json({ error: "Error" });
    }
});


app.delete('/movies/:id', async (req, res) =>
{
    const { id } = req.params;
    try
    {
        const result = await moviesCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount > 0)
        {
            res.json({ message: "Movie deleted" });
        }
        else
        {
            res.status(404).json({ error: "Movie not found" });
        }
    }
    catch (error)
    {
        res.status(500).json({ error: "Error" });
    }
});

run().catch(console.dir);
