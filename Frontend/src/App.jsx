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
// import CityPage from "./pages/CityPage";

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
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-login" element={<VerifyLogin />} />
          <Route path="/forget-password" element={<Forgetpassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;
