import React, { useState, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import './uploadbook.css'; // Import CSS

function UploadBook({ fetchBooks }) {
  const [bookID, setBookID] = useState('');
  const [bookName, setBookName] = useState('');
  const [message, setMessage] = useState('');
  const imageInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  const uploadBook = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('bookID', bookID);
    formData.append('bookName', bookName);
    if (imageInputRef.current?.files[0]) formData.append('image', imageInputRef.current.files[0]);
    if (pdfInputRef.current?.files[0]) formData.append('pdf', pdfInputRef.current.files[0]);

    try {
      await axios.post('http://localhost:5000/api/books/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessage('✅ Book uploaded successfully!');

      if (typeof fetchBooks === 'function') {
        fetchBooks();
      } else {
        console.warn("fetchBooks is not provided as a prop.");
      }

      // Reset input fields
      setBookID('');
      setBookName('');
      if (imageInputRef.current) imageInputRef.current.value = '';
      if (pdfInputRef.current) pdfInputRef.current.value = '';

    } catch (error) {
      setMessage('❌ Error uploading book');
      console.error('Error uploading book:', error.response?.data?.message || error.message);
    }
  };

  return (
    <motion.div 
      className="upload-book-container"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="upload-book-title">Upload a New Book 📚</h2>
      <form className="upload-book-form" onSubmit={uploadBook}>
        <input
          type="text"
          className="upload-book-input"
          placeholder="Enter Book ID"
          value={bookID}
          onChange={(e) => setBookID(e.target.value)}
        />
        <input
          type="text"
          className="upload-book-input"
          placeholder="Enter Book Name"
          value={bookName}
          onChange={(e) => setBookName(e.target.value)}
        />
        <input 
          ref={imageInputRef} 
          type="file" 
          accept="image/*" 
          className="upload-book-file" 
        />
        <input 
          ref={pdfInputRef} 
          type="file" 
          accept="application/pdf" 
          className="upload-book-file" 
        />
        <motion.button 
          className="upload-book-button"
          whileHover={{ scale: 1.1 }}
        >
          Upload 📤
        </motion.button>
      </form>
      {message && <p className="upload-book-message">{message}</p>}
    </motion.div>
  );
}

export default UploadBook;
