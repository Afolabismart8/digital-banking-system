require("dotenv").config(); //dotenv
const express = require ("express"); 
const app = express();
const connectDB = require ("./configs/database");

const onboardRoute = require("./routes/onboardRoute");
const accountRoute = require("./routes/accountRoute");
const transactionRoute = require("./routes/transactionRoute");

//Middlewares
app.use(express.json());

//ConnectDatabase
connectDB();

//Api
app.use ("/api", onboardRoute);
app.use("/api", accountRoute);
app.use("/api", transactionRoute);


app.get("/", (req,res) =>{
    res.status(200).json({status:"Success", Message:"App is running Live"})
});

//Server
const PORT = process.env.PORT;
app.listen (PORT , ()=> {
    console.log (`Server is Live On ${PORT}`)
});
