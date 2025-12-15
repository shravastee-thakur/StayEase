import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

const Navbar = () => {
  const navigate = useNavigate();
  const { verified, logout, role } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    const success = await logout();

    if (success) {
      navigate("/");
    }
  };

  return (
    <>
      <div className="h-16">
        <nav className="flex justify-between items-center text-sm font-semibold px-4 md:px-12 bg-[#2f7003] h-full">
          {/* Logo */}
          <div>
            <Link to={"/"}>
              <h1 className="text-2xl text-white md:text-3xl lg:text-4xl font-bold">
                StayEase
              </h1>
            </Link>
          </div>

          {/* Desktop Menu - Hidden on mobile */}
          <div className="hidden md:flex gap-4 md:gap-6 lg:gap-10 items-center">
            {role === "admin" ? (
              <p className="hover:text-yellow-200 transition cursor-pointer text-white text-lg">
                <Link to={"/all-booking"}> All Bookings</Link>
              </p>
            ) : (
              <p className="hover:text-yellow-200 transition cursor-pointer text-white text-lg">
                <Link to={"/my-bookings"}> My Bookings</Link>
              </p>
            )}

            <p className="hover:text-yellow-200 transition cursor-pointer text-white text-lg">
              <Link to={"/car-rental"}>Car Rental</Link>
            </p>
            {verified && role === "admin" && (
              <p className="hover:text-yellow-200 transition cursor-pointer text-white text-lg">
                <Link to={"/admin"}>Admin</Link>
              </p>
            )}
            {verified ? (
              <p
                onClick={handleLogout}
                className="hover:text-yellow-200 transition cursor-pointer text-white text-lg"
              >
                Logout
              </p>
            ) : (
              <>
                <p className="hover:text-yellow-200 transition cursor-pointer text-white text-lg">
                  <Link to={"/register"}>Register</Link>
                </p>
                <p className="hover:text-yellow-200 transition cursor-pointer text-white text-lg">
                  <Link to={"/login"}>Login</Link>
                </p>
              </>
            )}
          </div>

          {/* Hamburger Icon - Visible only on mobile */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {/* Hamburger icon (three lines) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </nav>
      </div>

      {/* Mobile Menu - Slides in from the right */}
      <div
        className={`md:hidden bg-[#05339C] z-50 px-4 pb-4 pt-2 mt-16 flex flex-col gap-3 fixed top-0 right-0 w-1/2 h-1/2 transform transition-transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ transitionDuration: "300ms" }}
      >
        <p className="cursor-pointer text-white text-base">Hotels</p>
        <p className="cursor-pointer text-white text-base">Car Rental</p>

        {verified ? (
          <p
            onClick={handleLogout}
            className="cursor-pointer text-yellow-300 text-base"
          >
            Logout
          </p>
        ) : (
          <>
            <p className="cursor-pointer text-yellow-300 text-base">
              <Link to={"/register"}>Register</Link>
            </p>
            <p className="cursor-pointer text-yellow-300 text-base">
              <Link to={"/login"}>Login</Link>
            </p>
          </>
        )}
      </div>
    </>
  );
};

export default Navbar;
