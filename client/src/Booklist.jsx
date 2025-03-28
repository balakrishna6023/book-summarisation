import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './booklist.css';

function Home() {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:5000"; // Backend base URL

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/books`);
      const updatedBooks = res.data.map(book => ({
        ...book,
        image: book.image ? `${BASE_URL}${book.image}` : '',
        filePath: book.pdf ? `${BASE_URL}${book.pdf}` : '',
      }));
      setBooks(updatedBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleDelete = async (bookID) => {
    try {
      await axios.delete(`${BASE_URL}/api/books/${bookID}`);
      fetchBooks();
    } catch (error) {
      alert('Error deleting book');
    }
  };

  const handleUpdate = (bookID) => {
    navigate(`/UpdateBook/${bookID}`);
  };

  return (
    <motion.div
      className="container"
      initial={{ opacity: 0 }}y
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <h1 className="title">📚 Book Summarization Platform</h1>

      <motion.button
        className="upload-btn"
        whileHover={{ scale: 1.1 }}
        onClick={() => navigate('/UploadBook')}
      >
        Upload Book 📤
      </motion.button>

      <div className="book-grid">
        {books.map((book) => (
          <motion.div key={book.bookID} className="book-card" whileHover={{ scale: 1.05 }}>
            {book.image && <img src={book.image} alt={book.bookName} className="book-image" />}
            <h3>{book.bookName}</h3>
            {book.filePath && (
              <a href={book.filePath} target="_blank" rel="noopener noreferrer" className="preview-link">
                View PDF
              </a>
            )}
            <motion.button whileHover={{ scale: 1.1 }} onClick={() => navigate(`/book/${book.bookID}`)}>Summarize 📖</motion.button>
            <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleUpdate(book.bookID)}>Update ✏️</motion.button>
            <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleDelete(book.bookID)}>Delete ❌</motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default Home;
