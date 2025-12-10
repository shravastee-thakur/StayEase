import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

// Mock hotel data — replace with API call
const mockHotels = [
  {
    id: "1",
    name: "Grand Mumbai Palace",
    city: "mumbai",
    type: "Luxury Hotel",
    address: "Marine Drive, Mumbai",
    distance: "2.5 km from center",
    description: "Luxury beachfront hotel with panoramic views.",
    cheapestPrice: 120,
    photos: ["/Hotel1.jpg"],
  },
  {
    id: "2",
    name: "Sea View Resort",
    city: "mumbai",
    type: "Resort",
    address: "Juhu Beach, Mumbai",
    distance: "5 km from center",
    description: "Family-friendly resort with pool and sea view.",
    cheapestPrice: 95,
    photos: ["/Hotel1.jpg"],
  },
];

const CityHotelsPage = () => {
  const { city } = useParams();
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    // In real app: fetch(`/api/hotels?city=${city}`)
    const filtered = mockHotels.filter((h) => h.city === city);
    setHotels(filtered);
  }, [city]);

  const cityNames = {
    mumbai: "Mumbai",
    delhi: "Delhi",
    hyderabad: "Hyderabad",
    bangalore: "Bangalore",
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Hotels in {cityNames[city] || city}
        </h1>
        <p className="text-gray-600 mb-8">
          Found {hotels.length} hotels available for your stay.
        </p>

        {hotels.length === 0 ? (
          <p className="text-center text-gray-500">
            No hotels available in this city yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <Link
                key={hotel.id}
                to={`/hotels/${hotel.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                {hotel.photos[0] && (
                  <img
                    src={hotel.photos[0]}
                    alt={hotel.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800">
                    {hotel.name}
                  </h3>
                  <p className="text-sm text-gray-600">{hotel.address}</p>
                  <p className="text-sm text-gray-500 mt-1">{hotel.type}</p>
                  <p className="text-green-600 font-semibold mt-2">
                    ₹{hotel.cheapestPrice}/night
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CityHotelsPage;
