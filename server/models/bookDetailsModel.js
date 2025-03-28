const mongoose = require('mongoose');

const bookDetailsSchema = new mongoose.Schema({
  bookID: Number,
  bookName: String,
  author: String,
  summary: String,
  keywords: String,
  zone: String,
});

module.exports = mongoose.model('BookDetails', bookDetailsSchema);
