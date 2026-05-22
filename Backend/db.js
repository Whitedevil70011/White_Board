const mongoose = require('mongoose');

const username="whiteboardDb"
const password="chandu123"
const connectionString = `mongodb+srv://${username}:${password}@cluster0.10393ob.mongodb.net/Whiteboard?appName=Cluster0`
const connectDB = async () => {

    try{
        await mongoose.connect(connectionString);
        console.log("Connected to database successfully");
    }
    catch(error){
        console.error("Error connecting to database:", error);
    }

}


module.exports = connectDB;