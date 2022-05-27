const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors =require("cors");
const port = 8080 || process.env.PORT;
const router = require("./router/router");

require("./db/conn"); //establishing connection with database

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());

app.use(cors());
app.use(router);


app.listen(port, ()=>{
    console.log("server up and running at " + port);
})
