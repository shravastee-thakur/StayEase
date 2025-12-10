// src/pages/HomePage.jsx
import { Link } from "react-router-dom";
import CoreFeatures from "../components/Corefeatures";

const HomePage = () => {
  const destinations = [
    {
      name: "Mumbai",
      image: "/Mumbai.jpg", // Gateway of India
      slug: "mumbai",
    },
    {
      name: "Delhi",
      image: "/Delhi.jpg", // Lotus Temple
      slug: "delhi",
    },
    {
      name: "Hyderabad",
      image: "/Hyderabad.jpg", // Charminar
      slug: "hyderabad",
    },
    {
      name: "Bangalore",
      image: "/Bangalore.jpg", // Vidhana Soudha
      slug: "bangalore",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-screen flex items-center justify-center overflow-hidden">
        <img
          src="/Hotel.jpg"
          alt="Luxury Resort"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10 text-white text-center px-6 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to StayEase
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Smart. Simple. Secure hotel bookings.
          </p>
          {/* <Link
            to="/search"
            className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-lg transition transform hover:scale-105"
          >
            Start Booking Now
          </Link> */}
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16 px-6 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Featured Destinations
          </h2>
        </div>

        <section className="px-10 sm:px-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {destinations.map((city) => (
            <Link
              key={city.slug}
              to={`/cities/${city.slug}`}
              className="h-[300px] w-full overflow-hidden relative rounded-lg shadow-md group transition-transform duration-300 hover:scale-105"
            >
              <img
                src={city.image}
                alt={city.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              {/* Overlay: City Name + Explore Button */}
              <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-opacity flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  {city.name}
                </h3>
                <button className="inline-flex items-center px-4 py-2 text-yellow-400 font-semibold rounded-md shadow-sm hover:text-white hover:bg-[#69c72b] transition-colors">
                  Explore Hotels →
                </button>
              </div>
            </Link>
          ))}
        </section>
      </section>

      <CoreFeatures />
    </div>
  );
};

export default HomePage;
