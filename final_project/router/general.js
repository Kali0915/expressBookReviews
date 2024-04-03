const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books,null,4));
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = parseInt(req.params.isbn);
  for (const id in books){
    let book = books[id];
    if (isbn == parseInt(book.isbn)){
      return res.send(JSON.stringify(book));
    }
  }
  return res.send("Unable to find book by ISBN");
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const book_author = [];
  for (const id in books){
    let book = books[id];
  
    if (book.author == author) {
      book_author.push({id: book})
    } 
  }
  if (book_author.length >0){
    res.send(JSON.stringify(book_author))
  } else {
    res.send("Unable to find book author")
  }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  for (const id in books){
    let book = books[id];
    if (book.title == title){
      return res.send(JSON.stringify(book))
    }
  }
  return res.send("Unable to find the book title");
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = parseInt(req.params.isbn);
  for (const id in books){
    let book = books[id];
    let book_isbn = parseInt(book.isbn)
    if (isbn == book_isbn){
      return res.send(JSON.stringify(book.review));
    }
  }
  return res.send("Unable to find book review by ISBN");
});

module.exports.general = public_users;
