
const mongoose = require('mongoose');

//MongoDb connection (modern way)
const connectToDatabase = async () =>
{
    try
    {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB Atlas");
    }
    catch(error)
    {
        console.log("Problem with connnetcting the DB");
        process.exit(1);
    }
};

module.exports = connectToDatabase;

