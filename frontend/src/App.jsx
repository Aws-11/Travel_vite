import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './Pages/Home';
import Hotels from './Pages/Hotels';
import HotelDetail from './Pages/HotelDetail';
import Login from './Pages/Login';
import ProfilePage from './Pages/ProfilePage';
import Register from './Pages/Register';
import About from './Pages/About';
import Contact from './Pages/Contact';
import AdminPanel from "./Pages/AdminPanel";
import ManageHotels from "./Pages/ManageHotels";
import AddHotel from "./Pages/AddHotel";
import EditHotel from './Pages/EditHotel';
import ManageBookings from './Pages/ManageBookings';
import ManageUsers from './Pages/ManageUsers';

function App() {
  const storedUser = JSON.parse(sessionStorage.getItem("user"));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/hotels/:id" element={<HotelDetail />} />
        <Route path="/login" element={<Login />} />
       
        <Route path="/registration" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        
        {storedUser ?  ( 
          <Route path="/profile" element={<ProfilePage />} />
        
        ) : <Route path="*" element={<Navigate to="/" />} /> }
        
        {storedUser?.role === "admin" && (
          <>
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/manage-hotels" element={<ManageHotels />} />
            <Route path="/admin/manage-bookings" element={<ManageBookings />} />
            <Route path="/admin/manage-users" element={<ManageUsers />} />
            <Route path="/admin/add-hotel" element={<AddHotel />} />
            <Route path="/admin/edit-hotel/:id" element={<EditHotel />} />
          </>
        )}
          <Route path="*" element={<Navigate to="/" />} />      
        
      </Routes>
    </Router>
  );
}

export default App;
