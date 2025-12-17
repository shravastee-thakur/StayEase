import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import RoomDetail from "./pages/RoomDetail";
import MyBooking from "./pages/user/MyBooking";
import CarRental from "./pages/CarRental";
import AdminBooking from "./pages/Admin/AllBookings";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import PaymentFailure from "./pages/payment/PaymentFailure";
import { useContext } from "react";
import { AuthContext } from "./context/AuthProvider";
import NotFoundPage from "./pages/NotFound";

const ProtectedAdminRoute = ({ children }) => {
  const { role } = useContext(AuthContext);

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <div className="bg-yellow-50">
      <div>
        <Toaster position="top-right" reverseOrder={false} />
      </div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <Admin />
              </ProtectedAdminRoute>
            }
          >
            <Route
              index
              element={
                <ProtectedAdminRoute>
                  <AdminHotels />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="hotels/:hotelId/rooms"
              element={
                <ProtectedAdminRoute>
                  <AdminRooms />
                </ProtectedAdminRoute>
              }
            />
          </Route>
          <Route
            path="/all-booking"
            element={
              <ProtectedAdminRoute>
                <AdminBooking />
              </ProtectedAdminRoute>
            }
          />

          <Route path="/" element={<HomePage />} />
          <Route path="/cities/:city" element={<CityHotelsPage />} />
          <Route path="/hotel/:hotelId/rooms" element={<Rooms />} />
          <Route path="/room-detail/:roomId" element={<RoomDetail />} />
          <Route path="/my-bookings" element={<MyBooking />} />
          <Route path="/car-rental" element={<CarRental />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-login" element={<VerifyLogin />} />
          <Route path="/forget-password" element={<Forgetpassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failure" element={<PaymentFailure />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;
