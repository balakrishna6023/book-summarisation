import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import BookDetails from './BookDetail';
import WelcomePage from './welcomePage';
import { motion } from 'framer-motion';
import './App.css';

function Home() {
  const [bookID, setBookID] = useState('');
  const [file, setFile] = useState(null);
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/books');
      setBooks(res.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const uploadBook = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('bookID', bookID);
    formData.append('file', file);
    await axios.post('http://localhost:5000/upload', formData);
    fetchBooks();
    setBookID('');
    setFile(null);
  };

  const handleDelete = async (bookID) => {
    try {
      await axios.delete(`http://localhost:5000/book/${bookID}`);
      fetchBooks();
    } catch (error) {
      alert('Error deleting book');
    }
  };

  return (
    <motion.div
      className="container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <h1 className="title">📚 Book Summarization Platform</h1>

      <motion.div
        className="upload-section"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <input
          type="text"
          placeholder="Enter Book ID"
          value={bookID}
          onChange={(e) => setBookID(e.target.value)}
        />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <motion.button whileHover={{ scale: 1.1 }} onClick={uploadBook}>
          Upload 📤
        </motion.button>
      </motion.div>

      <motion.table
        className="file-list"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <thead>
          <tr>
            <th>Book ID</th>
            <th>Book</th>
            <th>Preview</th>
            <th>Summarize</th>
            <th>Option</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.bookID}>
              <td>{book.bookID}</td>
              <td>{book.filePath.split('/').pop()}</td>
              <td>
                <a
                  href={`http://localhost:5000${book.filePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View 👁
                </a>
              </td>
              <td>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => navigate(`/book/${book.bookID}`)}
                >
                  Summarize 📖
                </motion.button>
              </td>
              <td>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => handleDelete(book.bookID)}
                >
                  Delete ❌
                </motion.button>
              </td>
            </tr>
          ))}
        </tbody>
      </motion.table>
    </motion.div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<WelcomePage />} />
        <Route path='/home' element={<Home />} />
        <Route path='/book/:bookID' element={<BookDetails />} />
      </Routes>
    </Router>
  );
}

export default App;