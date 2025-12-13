import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomProvider";

const SearchBar = ({ checkIn, checkOut, guests, onSearch }) => {
  const [dates, setDates] = useState({ checkIn, checkOut });
  const [guestCount, setGuestCount] = useState(guests);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!dates.checkIn || !dates.checkOut || guestCount < 1) {
      alert("Please select valid dates and at least 1 guest.");
      return;
    }
    onSearch(dates, guestCount);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-lg shadow mb-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Check-in
          </label>
          <input
            type="date"
            value={dates.checkIn}
            onChange={(e) => setDates({ ...dates, checkIn: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div>
          <label className="block text-sm font-metal text-gray-700">
            Check-out
          </label>
          <input
            type="date"
            value={dates.checkOut}
            onChange={(e) => setDates({ ...dates, checkOut: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            min={dates.checkIn || new Date().toISOString().split("T")[0]}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Guests
          </label>
          <select
            value={guestCount}
            onChange={(e) => setGuestCount(Number(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "Guest" : "Guests"}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-[#2f7003] text-white py-2 px-4 rounded-md hover:bg-[#255a02] transition"
          >
            Update Search
          </button>
        </div>
      </div>
    </form>
  );
};

const Rooms = () => {
  const { hotelId } = useParams(); // Get hotelId from URL
  const { fetchRooms } = useContext(RoomContext);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        setLoading(true);
        const roomsData = await fetchRooms(hotelId);
        setRooms(roomsData);
      } catch (err) {
        setError("Failed to load rooms");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (hotelId) {
      loadRooms();
    }
  }, [hotelId, fetchRooms]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading rooms...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500 text-lg">No rooms available</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Rooms</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div
            key={room._id}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <img
              src={room.image?.url}
              alt={room.type}
              className="w-full h-48 object-cover"
            />

            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-800">{room.type}</h3>
              <p className="text-sm text-blue-600 font-semibold mt-1">
                ₹{room.price} / night
              </p>
              <p className="text-sm text-gray-500">
                Max: {room.maxPeople} people
              </p>
              <p className="text-gray-700 text-sm mt-2 line-clamp-2">
                {room.description}
              </p>

              {/* Optional: Add booking button */}
              <button
                className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                onClick={() => {
                  // Handle booking logic here
                  console.log("Booking room:", room._id);
                }}
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
