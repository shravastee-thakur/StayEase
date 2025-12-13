// src/pages/Rooms.jsx
import { useState, useEffect, useContext } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { RoomContext } from "../context/RoomProvider";

// --- Keep your existing SearchBar component here (no changes needed) ---
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

const HotelRoomsPage = () => {
  const { hotelId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchRooms } = useContext(RoomContext);

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Parse current search params
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guests = searchParams.get("guests")
    ? parseInt(searchParams.get("guests"), 10)
    : 2;

  // Local state for search bar (sync with URL)
  const [searchState, setSearchState] = useState({
    checkIn: checkIn || "",
    checkOut: checkOut || "",
    guests: guests,
  });

  // Fetch rooms with date/guest context
  useEffect(() => {
    if (!hotelId || !searchState.checkIn || !searchState.checkOut) {
      setLoading(false);
      return;
    }

    const loadRooms = async () => {
      try {
        setLoading(true);
        setError(null);

        // Pass dates & guests to backend
        const roomsData = await fetchRooms(hotelId, {
          checkIn: searchState.checkIn,
          checkOut: searchState.checkOut,
          guests: searchState.guests,
        });

        setRooms(roomsData);
      } catch (err) {
        setError("Failed to load available rooms. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, [
    hotelId,
    searchState.checkIn,
    searchState.checkOut,
    searchState.guests,
    fetchRooms,
  ]);

  // Update URL and refetch when user submits search
  const handleSearch = (dates, guestCount) => {
    const params = new URLSearchParams({
      checkIn: dates.checkIn,
      checkOut: dates.checkOut,
      guests: guestCount.toString(),
    });
    setSearchParams(params); // This will re-trigger the effect above
  };

  // Sync URL changes (e.g., browser back button)
  useEffect(() => {
    const ci = searchParams.get("checkIn");
    const co = searchParams.get("checkOut");
    const g = searchParams.get("guests");
    setSearchState({
      checkIn: ci || "",
      checkOut: co || "",
      guests: g ? parseInt(g, 10) : 2,
    });
  }, [searchParams]);

  // Handle booking: navigate to booking page with all context
  const handleBook = (roomId) => {
    // Preserve all search params and add room & hotel
    navigate(
      `/booking?${searchParams.toString()}&hotelId=${hotelId}&roomId=${roomId}`
    );
  };

  if (!searchState.checkIn || !searchState.checkOut) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Select Your Stay
        </h2>
        <SearchBar
          checkIn={searchState.checkIn}
          checkOut={searchState.checkOut}
          guests={searchState.guests}
          onSearch={handleSearch}
        />
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <p className="text-yellow-700">
            Please select check-in and check-out dates to view available rooms.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <SearchBar
          checkIn={searchState.checkIn}
          checkOut={searchState.checkOut}
          guests={searchState.guests}
          onSearch={handleSearch}
        />

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-lg">
            Loading available rooms...
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            No rooms available for the selected dates and guest count.
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Available Rooms ({rooms.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div
                  key={room._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition"
                >
                  {room.image?.url && (
                    <img
                      src={room.image.url}
                      alt={room.type}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-800">
                      {room.type}
                    </h3>
                    <p className="text-sm text-[#2f7003] font-semibold mt-1">
                      ₹{room.price} / night
                    </p>
                    <p className="text-sm text-gray-500">
                      Max: {room.maxPeople} people
                    </p>
                    <p className="text-gray-700 text-sm mt-2 line-clamp-2">
                      {room.description || "Comfortable and modern room."}
                    </p>
                    <button
                      className="w-full mt-4 px-4 py-2 bg-[#2f7003] text-white rounded hover:bg-[#255a02] transition-colors"
                      onClick={() => handleBook(room._id)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HotelRoomsPage;
