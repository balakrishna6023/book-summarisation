const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  bookID: String,
  bookName: String, 
  image: String,  
  pdf: String,
});

module.exports = mongoose.model('Books', bookSchema);
