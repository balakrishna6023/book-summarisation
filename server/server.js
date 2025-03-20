const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/book_summarization')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Define Book Schema
const bookSchema = new mongoose.Schema({
  bookID: String,
  filePath: String,
});

const Book = mongoose.model('Book', bookSchema);

const bookDetailsSchema = new mongoose.Schema({
  bookID: Number,
  bookName: String,
  author: String,
  summary: String,
  keywords: String,
  zone: String,
});

const BookDetails = mongoose.model('BookDetails', bookDetailsSchema);

// Multer Storage for File Uploads
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Upload Book API
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { bookID } = req.body;
    const newBook = new Book({
      bookID,
      filePath: `/uploads/${req.file.filename}`,
    });
    await newBook.save();

    // const details = new BookDetails({
    //   bookID,
    // });
    // await details.save();

    res.json({ message: 'Book Uploaded', book: newBook });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error });
  }
});

// Fetch All Books API
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error });
  }
});

// Fetch Book Details API
app.get('/book/:bookID', async (req, res) => {
    const bookID = req.params.bookID;
  try {
    const book = await BookDetails.findOne({ bookID: bookID.trim() });

    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book details', error });
  }
});

// Delete Book API
app.delete('/book/:bookID', async (req, res) => {
  try {
    const book = await Book.findOne({ bookID: req.params.bookID });
    if (book) {
      await Book.findOneAndDelete({ bookID: req.params.bookID });
      res.json({ message: 'Book deleted successfully' });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err });
  }
});

// Start Server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
