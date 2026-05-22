const express = require('express');
const app = express();
const connectDB = require('./db');

connectDB();
const cors = require("cors");
app.use(cors());
app.use(express.json());


// function addhelleoworld(req, res, next) {
//     res.customdata="hello  useer we added custom data in response object";
//     // res.end();

//     next();
// }

const userRoute = require("./routes/userRoute");
app.use("/user",userRoute);
 const postRoute = require("./routes/postRoute");


app.use("/post",postRoute);

const canvasRoute = require("./routes/canvasRoute");
app.use("/canvas",canvasRoute   );



// const registerRoute = require("./routes/registerRoute");
// app.use("/register",registerRoute);



app.listen(3030,()=>{
    console.log("server is running on")
})