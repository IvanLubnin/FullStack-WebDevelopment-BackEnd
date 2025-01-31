## 1. MongoDB Connection

### 1.1. Install MongoDB Driver
To work with MongoDB in Node.js, the MongoDB driver is installed using the following command:

```bash
npm install mongodb
```

### 1.2. Setting up the Connection
To connect to the MongoDB database, the URI provided by MongoDB Atlas is used. It contains information about the database and credentials for authentication.

```javascript
const uri = "mongodb+srv://<username>:<password>@cluster1.yp6zm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";
```

I replaced `<username>` and `<password>` with your actual credentials.

In the MongoDB client, the connection is initialized as follows:

```javascript
const client = new MongoClient(uri,
{
    serverApi:
    {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
```

## 2. Setting up the Express Server

### 2.1. Install Express
The Express framework is installed to handle HTTP requests:

```bash
npm install express
```

### 2.2. Initializing the Express Server

```javascript
const express = require('express');
const app = express();
const port = 3004;
```

### 2.3. Connecting to the Server

The server runs on port 3004:

```javascript
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
```

### 2.4. Middleware for JSON Parsing

Middleware is used to handle incoming JSON data in the request body:

```javascript
app.use(express.json());
```

## 3. CRUD Operations

The application supports basic CRUD operations to interact with movies in the database:

### 3.1. Get All Movies (GET /movies)

This route retrieves all movies from the `movies` collection in MongoDB:

```javascript
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
```

### 3.2. Get Movie by ID (GET /movies/:id)

This route retrieves a movie by its ID:

```javascript
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
    }
    catch (error)
    {
        res.status(500).json({ error: "Error" });
    }
});
```

### 3.3. Add New Movie (POST /movies)

This route adds a new movie to the `movies` collection:

```javascript
app.post('/movies', async (req, res) =>
{
    const newMovie = req.body;
    try
    {
        const result = await moviesCollection.insertOne(newMovie);
        res.status(201).json(result.ops[0]);
    }
    catch (error)
    {
        res.status(500).json({ error: "Error" });
    }
});
```

### 3.4. Update Movie by ID (PUT /movies/:id)

This route updates an existing movie by its ID:

```javascript
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
```

### 3.5. Delete Movie by ID (DELETE /movies/:id)

This route deletes a movie by its ID:

```javascript
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
```

## 4. Testing the API with Postman

Once the server is running, you can test all CRUD routes using Postman. Example requests:

### 4.1. GET /movies
Request to get all movies:
- **Method**: GET
- **URL**: `http://localhost:3004/movies`

### 4.2. GET /movies/:id
Request to get a movie by ID:
- **Method**: GET
- **URL**: `http://localhost:3004/movies/{id}` (replace `{id}` with an actual movie ID)

### 4.3. POST /movies
Request to add a new movie:
- **Method**: POST
- **URL**: `http://localhost:3004/movies`
- **Request Body**:
  ```json
  {
    "title": "Inception",
    "director": "Christopher Nolan",
    "year": 2010
  }
  ```

### 4.4. PUT /movies/:id
Request to update a movie:
- **Method**: PUT
- **URL**: `http://localhost:3004/movies/{id}` (replace `{id}` with an actual movie ID)
- **Request Body**:
  ```json
  {
    "title": "Inception 2",
    "director": "Christopher Nolan",
    "year": 2025
  }
  ```

### 4.5. DELETE /movies/:id
Request to delete a movie:
- **Method**: DELETE
- **URL**: `http://localhost:3004/movies/{id}` (replace `{id}` with an actual movie ID)

## 5. Conclusion

Application is now fully connected to MongoDB, and all CRUD operations have been tested and configured.

