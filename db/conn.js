const mongoose = require("mongoose");
require("dotenv").config();

const db = `mongodb+srv://root:${process.env.db_password}@cluster0.gw2de.mongodb.net/mernCrud?retryWrites=true&w=majority`;

mongoose.connect(db, {
    useNewUrlParser : true
}).then(()=>console.log("Connection start")).catch((err)=>console.log(err));

