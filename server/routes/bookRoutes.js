const express = require("express");
const Book = require("../models/bookModel");
const BookDetails = require("../models/bookDetailsModel");
const upload = require("../middleware/upload");

const router = express.Router();

// Upload Book
router.post(
  "/upload",
  upload.fields([{ name: "pdf" }, { name: "image" }]),
  async (req, res) => {
    try {
      const { bookID, bookName } = req.body;

      const newBook = new Book({
        bookID,
        bookName,
        image:
          req.files && req.files["image"]
            ? `/uploads/${req.files["image"][0].filename}`
            : "",
        pdf:
          req.files && req.files["pdf"]
            ? `/uploads/${req.files["pdf"][0].filename}`
            : "", // Fixed this line
      });

      await newBook.save();
      res.json({ message: "Book Uploaded", book: newBook });
    } catch (error) {
      res.status(500).json({ message: "Upload failed", error });
    }
  }
);
// Fetch All Books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
});

// Fetch Book Details
router.get("/:bookID", async (req, res) => {
  try {
    const book = await Book.findOne({ bookID: req.params.bookID.trim() });
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching book details", error });
  }
});

// Update Book Details
router.put(
  "/:bookID",
  upload.fields([{ name: "pdf" }, { name: "image" }]),
  async (req, res) => {
    try {
      const { bookName } = req.body;
      const bookID = req.params.bookID.trim();

      const updatedFields = {};
      if (bookName) updatedFields.bookName = bookName;
      if (req.files["image"])
        updatedFields.image = `/uploads/${req.files["image"][0].filename}`;
      if (req.files["pdf"])
        updatedFields.pdf = `/uploads/${req.files["pdf"][0].filename}`;

      const updatedBook = await Book.findOneAndUpdate(
        { bookID },
        updatedFields,
        { new: true }
      );

      if (updatedBook) {
        res.json({ message: "Book updated successfully", book: updatedBook });
      } else {
        res.status(404).json({ message: "Book not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error updating book details", error });
    }
  }
);

// Delete Book
router.delete("/:bookID", async (req, res) => {
  try {
    const book = await Book.findOne({ bookID: req.params.bookID });
    if (book) {
      await Book.findOneAndDelete({ bookID: req.params.bookID });
      res.json({ message: "Book deleted successfully" });
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

router.get("/book/:bookID", async (req, res) => {
  const bookID = req.params.bookID;
  try {
    const book = await BookDetails.findOne({ bookID: bookID.trim() });

    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching book details", error });
  }
});

module.exports = router;
