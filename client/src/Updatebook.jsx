import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import './updatebook.css';

const UpdateBook = () => {
  const { bookID } = useParams();
  const navigate = useNavigate();
  const [bookName, setBookName] = useState("");
  const [pdf, setPdf] = useState(null);
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchBookDetails();
  }, []);

  const fetchBookDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/books/${bookID}`);
      setBookName(res.data.bookName || "");
    } catch (error) {
      console.error("Error fetching book details", error);
      setMessage("Failed to fetch book details.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (bookName) formData.append("bookName", bookName);
    if (pdf) formData.append("pdf", pdf);
    if (image) formData.append("image", image);

    try {
      const res = await axios.put(`http://localhost:5000/api/books/${bookID}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(res.data.message);
      setTimeout(() => navigate("/home"), 2000); // Redirect after update
    } catch (error) {
      console.error("Error updating book", error);
      setMessage("Failed to update book.");
    }
  };

  return (
    <motion.div
      className="update-book-wrapper"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="update-book-header">Update Book</h2>
      {message && <p className="update-book-message">{message}</p>}
      
      <form onSubmit={handleUpdate} className="update-book-form">
        <div>
          <label>Book Name:</label>
          <input
            type="text"
            className="update-book-input"
            value={bookName}
            onChange={(e) => setBookName(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label>Upload PDF:</label>
          <input
            type="file"
            className="update-book-file"
            accept="application/pdf"
            onChange={(e) => setPdf(e.target.files[0])}
          />
          {pdf && <p>{pdf.name}</p>}
        </div>
        
        <div>
          <label>Upload Image:</label>
          <input
            type="file"
            className="update-book-file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
          {image && <img src={URL.createObjectURL(image)} alt="Preview" className="update-book-preview" />}
        </div>

        <motion.button 
          type="submit"
          className="update-book-button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Update Book
        </motion.button>
      </form>
    </motion.div>
  );
};

export default UpdateBook;
