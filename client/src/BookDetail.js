import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./bookdetails.css";

function BookDetails() {
  const { bookID } = useParams();
  const [book, setBook] = useState(null);
  const [animatedTable, setAnimatedTable] = useState({
    bookName: "",
    author: "",
    summary: "",
    keywords: "",
    zone: "",
  });
  const [visibleRows, setVisibleRows] = useState(0); // Controls row visibility

  useEffect(() => {
    fetchBookDetails();
  }, []);

  const fetchBookDetails = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/books/book/${bookID}`
      );
      setBook(res.data);
    } catch (error) {
      console.error("Error fetching book details", error);
    }
  };

  useEffect(() => {
    if (book) {
      animateTable();
    }
  }, [book]);

  const animateTable = async () => {
    if (!book) return; // Ensure book is loaded before animation

    const tableData = {
      bookName: book.bookName || "",
      author: book.author || "",
      summary: book.summary || "",
      keywords: book.keywords || "",
      zone: book.zone || "",
    };

    let delay = 0;

    for (const key of Object.keys(tableData)) {
      if (!tableData[key]) continue; // Skip empty values

      await new Promise((resolve) => {
        setTimeout(() => {
          let currentText = "";
          let index = 0;
          const interval = setInterval(() => {
            if (index < (tableData[key]?.length || 0)) {
              currentText += tableData[key][index];
              setAnimatedTable((prev) => ({ ...prev, [key]: currentText }));
              index++;
            } else {
              clearInterval(interval);
              setVisibleRows((prev) => prev + 1); // Show next row
              resolve();
            }
          }, 30);
        }, delay);
      });

      delay += 500; // Wait before starting next row
    }
  };

  if (!book) {
    return <h2>Loading book details...</h2>;
  }

  return (
    <div className="book-details-container">
      <center>
        <h1 className="title">📚 Summarization</h1>
      </center>

      <table className="book-details-table">
        <tbody>
          {visibleRows >= 0 && book.bookName && (
            <tr>
              <td>
                <strong>📖 Book Name:</strong>
              </td>
              <td>{animatedTable.bookName || "..."}</td>
            </tr>
          )}
          {visibleRows >= 1 && book.author && (
            <tr>
              <td>
                <strong>✍️ Author:</strong>
              </td>
              <td>{animatedTable.author || "..."}</td>
            </tr>
          )}
          {visibleRows >= 2 && book.summary && (
            <tr>
              <td>
                <strong>📜 Summary:</strong>
              </td>
              <td>{animatedTable.summary || "..."}</td>
            </tr>
          )}
          {visibleRows >= 3 && book.keywords && (
            <tr>
              <td>
                <strong>🔑 Keywords:</strong>
              </td>
              <td>{animatedTable.keywords || "..."}</td>
            </tr>
          )}
          {visibleRows >= 4 && book.zone && (
            <tr>
              <td>
                <strong>📍 Zone:</strong>
              </td>
              <td>{animatedTable.zone || "..."}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default BookDetails;
