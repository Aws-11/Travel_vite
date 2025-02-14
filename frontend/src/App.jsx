import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './Pages/Home';
import Hotels from './Pages/Hotels';
import HotelDetail from './Pages/HotelDetail';
import Login from './Pages/Login';
import ProfilePage from './Pages/ProfilePage';
import Register from './Pages/Register';
import About from './Pages/About';
import Contact from './Pages/Contact';
import NotFoundPage from './Pages/NotFoundPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/hotels' element={<Hotels />} />
        <Route path="/hotels/:id" element={<HotelDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/registration" element={<Register />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
