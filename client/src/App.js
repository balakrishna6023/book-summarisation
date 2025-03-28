
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

import UploadBook from './Uploadbook';
import './App.css';
import WelcomePage from './welcomePage';
import BookDetails from './BookDetail';
import Home from './Booklist';
import UpdateBook from './Updatebook';
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<WelcomePage />} />
        <Route path='/home' element={<Home />} />
        <Route path='/book/:bookID' element={<BookDetails />} />
        <Route path='/UploadBook' element={<UploadBook />} />
        <Route path='/UpdateBook/:bookID' element={<UpdateBook />} />
      </Routes>
    </Router>
  );
}

export default App;
