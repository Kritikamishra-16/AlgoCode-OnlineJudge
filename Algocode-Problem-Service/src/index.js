const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require("./routes");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());

const { PORT } = require('./config/server.config');
const BaseError = require('./errors/base.error');
const errorHandler = require('./utils/errorHandler');
const connectToDB = require('./config/db.config');

//If any request comes and route starts with /api we map it to apiRoute
app.use("/api",apiRouter);

app.get('/ping', (req,res)=>{
    return res.json({message: "Problem service is alive"});
});

// register error handler as a middleware after all of the requests
// this is a last middleware if any error comes
app.use(errorHandler); 

app.listen(PORT, async ()=>{
    console.log(`Server started at PORT ${PORT}`);
    await connectToDB();
    console.log("Successfully connected to db");
});


