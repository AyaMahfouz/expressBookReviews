const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let q_user = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(q_user.length>0){
        return true;
    }
    else{
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    //Write your code here
    const uname = req.body.username;
    const pass = req.body.password;
    if(authenticatedUser(uname,pass)){
        let accessToken = jwt.sign({
            data:pass},
            "access",
            { expiresIn: 60 * 60 }
        )
        req.session.authorization = {accessToken,uname};
        return res.status(200).send("User successfully logged in");
    }
    else{
        return res.status(404).json({message:"Invalid login. Check username and password"})
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    let user = req.session.authorization.username;
    let new_review = req.body.reviews;
    let reviewed_book = books[req.params.isbn];
    console.log(user);
    console.log(new_review);
    console.log(reviewed_book);
    if(reviewed_book){
        reviewed_book.reviews[user] = new_review;
        return res.status(200).send("Review successfully posted");
    }else{
        return res.status(404).json({message:"Book not found"});
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
    let user = req.session.authorization.username;
    let reviewed_book = books[req.params.isbn];
    if(reviewed_book){
        reviewed_book.reviews[user] = "";
        return res.status(200).send("Review successfully deleted");
    }else{
        return res.status(404).json({message:"Book not found"});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
