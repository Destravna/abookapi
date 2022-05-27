const mongoose = require("mongoose");

/*
    "book":
	number: 2,
	books:[{id:(generated automatically),
        name:"2 States",author:"Chetan Bhagat",
        rating:5,ratersNumber:1,
        raters:["ayush","shekhar","madhav"]}
	]
*/

const backendSchema = new mongoose.Schema({
    name : {
        type:String,
        unique:true,
        required:true
    },
    details : {
        number : {
            type:Number,
            default:0
        },
        books : [
            {
                id : mongoose.Schema.Types.ObjectId,
                name : {
                    type:String,
                    required:true
                },
                author : {
                    type:String,
                    required:true
                },
                rating:{
                    type:Number,
                },
                ratersNumber:{
                    type:Number,
                    required:true
                },
                raters:[{
                    type:String
                }]
            }
        ]
    }
});

const backEnd = new mongoose.model("backend", backendSchema);

module.exports = backEnd;