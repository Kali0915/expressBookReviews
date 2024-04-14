const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}
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

function retreiveBook(){
 return new Promise((resolve,reject) => {
  resolve(books)
})}


// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  let listOfBooks = await retreiveBook()
  res.json(listOfBooks)
});

function BookByISBN(isbn){
  return new Promise ((resolve,reject)=>{
    let book_isbn = parseInt(isbn)
    for (const id in books){
      let book = books[id]
      if (book_isbn == parseInt(book.isbn)){
        resolve(book)
      } 
    }
  })
}
// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = parseInt(req.params.isbn);
  BookByISBN(isbn)
  .then(result => res.json(result))
  .catch(error => 
    console.log(error))
  
 });

function BookByAuthor(Author){
  return new Promise ((resolve,reject)=>{
    let bookAuthor = Author
    const book_author = [];
    for (const id in books){
      let book = books[id]
      if (bookAuthor == book.author){
        book_author.push({id: book})
        resolve(book_author)
      } 
    }
  })
}
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  BookByAuthor(author)
  .then(
    result => res.json(result)
  ).catch(
    error => console.log(error)
  )

});

function BookByTitle(Title){
  return new Promise ((resolve,reject)=>{
    let bookTitle = Title
    for (const id in books){
      let book = books[id]
      if (bookTitle == book.title){
        resolve(book)
      } 
    }
  })
}
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  BookByTitle(title)
  .then(
    result => res.json(result)
  ).catch(
    error => console.log(error)
  )
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = parseInt(req.params.isbn);
  for (const id in books){
    let book = books[id];
    let book_isbn = parseInt(book.isbn)
    if (isbn == book_isbn){
      return res.send(JSON.stringify(book.reviews));
    }
  }
  return res.send("Unable to find book review by ISBN");
});


public_users.put('/review/:isbn',function (req, res) {
  const isbn = parseInt(req.params.isbn);
  const review = req.body
  
  let us = Object.keys(review)
  console.log(us)
  
  for (const id in books){
    let book = books[id];
    let book_isbn = parseInt(book.isbn)
    if (isbn == book_isbn){
      book.reviews[us] = review[us];
      return res.send("Review is added succesfully");
    }
  }
  return res.send("could not review by ISBN");
});

module.exports.general = public_users;
