const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60*60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = parseInt(req.params.isbn);
  const review = req.body
  
  const username = req.session.authorization.username;
  
  for (const id in books){
    let book = books[id];
    let book_isbn = parseInt(book.isbn)
    if (isbn == book_isbn){
      if (book.reviews[username]){
        book.reviews[username] = review["id"];
        return res.send("Review is updated succesfully");
      } else {
        book.reviews[username] = review["id"];
        return res.send("Review is added succesfully");
      }
    }
  }
  return res.send("could not review by ISBN");
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = parseInt(req.params.isbn);
  const username = req.session.authorization.username;

  for (const id in books){
    let book = books[id];
    let book_isbn = parseInt(book.isbn)
    if (isbn == book_isbn){
      if (book.reviews[username]){
        console.log(book.reviews[username])
        delete book.reviews[username]
        return res.send("Comment is deleted succesfully")
      } else {
        return res.send("Nothing to delete")
      }
    }
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
