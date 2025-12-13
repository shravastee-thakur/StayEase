import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CityHotelsPage from "./pages/CityHotelsPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Register from "./pages/user/Register";
import VerifyLogin from "./pages/user/VerifyLogin";
import Login from "./pages/user/Login";
import Forgetpassword from "./pages/user/ForgetPassword";
import ResetPassword from "./pages/user/ResetPassword";
import { Toaster } from "react-hot-toast";
import Admin from "./pages/Admin/Admin";
import AdminHotels from "./pages/Admin/AdminHotels";
import AdminRooms from "./pages/Admin/AdminRooms";
import Rooms from "./pages/Rooms";
import HotelRoomsPage from "./pages/HotelRoomsPage";

const App = () => {
  return (
    <div>
      <div>
        <Toaster position="top-right" reverseOrder={false} />
      </div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cities/:city" element={<CityHotelsPage />} />
          <Route path="/hotel/:hotelId/rooms" element={<Rooms />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-login" element={<VerifyLogin />} />
          <Route path="/forget-password" element={<Forgetpassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/hotelRoomsPage" element={<HotelRoomsPage />} />
          <Route path="/admin" element={<Admin />}>
            <Route index element={<AdminHotels />} />
            <Route path="hotels/:hotelId/rooms" element={<AdminRooms />} />
          </Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;
