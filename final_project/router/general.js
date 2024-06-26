const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const checkUsername = (uname)=>{
    let q_user = users.filter(user =>{
        return user.username === uname;
    });
    if (q_user.length>0){
        return true;
    }
    else{
        return false;
    }
}

retrieveAllBooks = ()=>{
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books);
        }, 1000);
    });
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const uname = req.body.username;
  const pass = req.body.password;
  if(uname && pass){
    if(checkUsername(uname)){
        return res.status(404).json({message:"User already exists"});
    }
    else{
        users.push({"username":uname, "password":pass});
        return res.status(200).json({message:"User registered successfully, you can now login"});
    }
  }else{
    return res.status(404).json({message:"Username or password missing"});
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  try{
    const allBooks = await retrieveAllBooks();
    return res.send(JSON.stringify(books,null,4));
  }
  catch{
    res.status(500).json({message: "Internal Server Error"});
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  try{
    const allBooks = await retrieveAllBooks();
    let isbnBook = allBooks[req.params.isbn];
    return res.send(JSON.stringify(isbnBook,null,4));
  }
  catch{
    res.status(500).json({message: "Internal Server Error"});
  }
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
    try{
        const allBooks = await retrieveAllBooks();
        let q_author = req.params.author.toLowerCase();
        let selectedBook = [];
        
        selectedBook = Object.values(allBooks).filter((book)=>{
            return book.author.toLowerCase() === q_author;
        });

        
        if(selectedBook.length>0){
            return res.send(JSON.stringify(selectedBook,null,4));
        }
        else{
            return res.status(300).json({message:"Author not found"});
        }
    }
    catch{
        res.status(500).json({message: "Internal Server Error"});
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
    try{
        const allBooks = await retrieveAllBooks();
        let q_title = req.params.title.toLowerCase();
        let selectedBook = [];
        
        selectedBook = Object.values(allBooks).filter((book)=>{
            return book.title.toLowerCase() === q_title;
        });

        
        if(selectedBook.length>0){
            return res.send(JSON.stringify(selectedBook,null,4));
        }
        else{
            return res.status(300).json({message:"Book title not found"});
        }
    }
    catch{
        res.status(500).json({message: "Internal Server Error"});
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  q_review = books[req.params.isbn].reviews;
  console.log(q_review);
  return res.send(q_review,null,4);
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
