const express = require("express");
const router = express.Router();
const Backend = require("../db/model/backendSchema");


try{
    //inseting a new book into the database
router.post("/books", async(req, res)=>{
    const newData = req.query;
    if(!newData.name || !newData.author || !newData.rating || !newData.ratersNumber || !newData.raters){
        return res.status(400).json("Please fill all the details");
    }
    else{
        //checking if there is a book in the data or not
        const check =  await Backend.findOne({name : "books"}).catch(err=>console.log(err));
        if(!check){
            const bookData = new Backend({
                name : "books",
                details : {
                    books : []
                }
            })
            await bookData.save().catch(err=>console.log(err));
            return res.status(201).json("Data saved successfully");
        }
        else{
            let initialData = await Backend.findOne({name : "books"}).catch(err=>console.log(err));
            let currentBooks = initialData.details.books;
            let bookAlreadyExists = currentBooks.some(book => book['name'] === newData.name);
            if(bookAlreadyExists){
                return res.status(400).json("Book Already exists");
            }
            else{
                await Backend.updateOne({"name":"books"}, {
                    $push :{
                        "details.books" : {
                            name : newData.name, 
                            author : newData.author, 
                            rating: newData.rating, 
                            ratersNumber : newData.ratersNumber, 
                            raters : newData.raters
                        }
                    },
                    $inc : {
                        "details.number" : 1
                    }
                }).catch(err=>console.log(err));
                return res.status(201).json("data saved successfully");
            }
        }
    }
})

//API - 1
//returning details of the requested book
router.get("/book/:title", async(req, res)=>{
    let bookTitle = req.params.title;
    console.log(bookTitle);
    let initialData = await Backend.findOne({name : "books"}).catch(err=>console.log(err));
    let currentBooks = initialData.details.books;
    let foundBook = currentBooks.find((book)=>{
        return book.name === bookTitle;
    })
    if(foundBook === undefined){
        return res.status(400).json({"status":false, "details":null});
    }
    else{
        console.log(foundBook);
        return res.status(201).json({"status":true, "details":foundBook});
    }
})


//API-2
//check if user has rated a book or not
router.get("/ratingStatus/:username/:book", async(req, res)=>{
    let username = req.params.username;
    let bookName = req.params.book;
    let initialData = await Backend.findOne({name : "books"}).catch(err=>console.log(err));
    let currentBooks = initialData.details.books;
    let foundBook = currentBooks.find((book)=>{
        return book.name === bookName;
    })

    if(foundBook === undefined){
        return res.status(400).json("No such book exists");
    }
    else{
        if(foundBook.raters.includes(username)){
            return res.status(201).json({"status":true, "rating":foundBook.rating, "books" : initialData});
        }
        else{
            return res.status(400).json({"status":false, "rating":null, "books" : initialData})
        }
    }
})

//API-3
//rating a book
router.post("/rating/:username/:book/:rate", async(req, res)=>{
    let username = req.params.username;
    let bookName = req.params.book;
    let rate = req.params.rate;
    let initialData = await Backend.findOne({name : "books"}).catch(err=>console.log(err));
    let currentBooks = initialData.details.books;
    let foundBook = currentBooks.find((book)=>{
        return book.name === bookName;
    })
    if(foundBook === undefined){
        res.status(400).json({"status" : false});
    }
    else{
        let newRating = (foundBook.rating *  foundBook.ratersNumber + rate)/(foundBook.ratersNumber + 1);
        await Backend.updateOne({"name" : "books", "details.books" : {
            $elemMatch : {
                name : foundBook.name
            }
        }}, {
            $set : {
                "details.books.$.rating" : newRating
            },
            $set : {
                "details.books.$.ratersNumber" : foundBook.ratersNumber + 1
            },
            $push : {
                "details.books.$.raters" : username
            }
        }).catch(err=>console.log(err));
        res.status(201).json({"status" : true});
    }
})

}
catch(err){
    console.log(err);
}

module.exports = router;