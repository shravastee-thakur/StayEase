import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthProvider";
import { RoomContext } from "../context/RoomProvider";

const RoomDetail = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { verified } = useContext(AuthContext);
  const { getRoomById } = useContext(RoomContext);

  // Extract initial dates from URL search params (if user came from hotel page)
  const searchParams = new URLSearchParams(location.search);
  const initialCheckIn = searchParams.get("checkIn") || "";
  const initialCheckOut = searchParams.get("checkOut") || "";
  const initialGuests = parseInt(searchParams.get("guests")) || 1;

  // State
  const [room, setRoom] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dates, setDates] = useState({
    checkIn: initialCheckIn,
    checkOut: initialCheckOut,
  });
  const [guests, setGuests] = useState(initialGuests);
  const [isAvailable, setIsAvailable] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Fetch room details
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const roomData = await getRoomById(roomId);
        setRoom(roomData);
      } catch (err) {
        setError("Failed to load room details");
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomId]);

  // Check availability whenever dates change (debounced in real app)
  useEffect(() => {
    if (!dates.checkIn || !dates.checkOut) {
      setIsAvailable(null);
      return;
    }

    const checkAvail = async () => {
      setCheckingAvailability(true);
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/bookings/checkRoomAvailability/${roomId}`,
          {
            params: { startDate: dates.checkIn, endDate: dates.checkOut },
          }
        );
        setIsAvailable(res.data.data.isAvailable);
      } catch (err) {
        setIsAvailable(false);
      } finally {
        setCheckingAvailability(false);
      }
    };

    const timeout = setTimeout(checkAvail, 500);
    return () => clearTimeout(timeout);
  }, [dates, roomId]);

  const handleBook = async () => {
    if (!user) {
      // Redirect to login with return URL
      navigate(
        `/login?redirect=${encodeURIComponent(
          location.pathname + location.search
        )}`
      );
      return;
    }

    if (!isAvailable) {
      alert("This room is not available for the selected dates.");
      return;
    }

    const nights = Math.ceil(
      (new Date(dates.checkOut) - new Date(dates.checkIn)) /
        (1000 * 60 * 60 * 24)
    );
    const totalAmount = nights * room.price;

    setBookingLoading(true);
    try {
      const res = await axios.post("/api/bookings", {
        roomId,
        hotelId: room.hotelId,
        startDate: dates.checkIn,
        endDate: dates.checkOut,
        totalAmount,
      });

      if (res.data.success) {
        alert("Booking created successfully!");
        navigate("/my-bookings");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Room Image */}
        <div className="h-64 md:h-96 overflow-hidden">
          <img
            src={room.image?.url || "/placeholder-room.jpg"}
            alt={room.type}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Room Info */}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">{room.type}</h1>
          <p className="text-gray-600 mt-2 line-clamp-3">{room.description}</p>

          <div className="flex items-center mt-4 text-sm text-gray-500">
            <span>Max {room.maxPeople} guests</span>
            <span className="mx-2">•</span>
            <span>₹ {room.price} price / night</span>
          </div>

          {/* Booking Form */}
          <div className="mt-8 bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Select your stay :
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Check-in */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Check-in
                </label>
                <input
                  type="date"
                  value={dates.checkIn}
                  min={today}
                  onChange={(e) =>
                    setDates({ ...dates, checkIn: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              {/* Check-out */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Check-out
                </label>
                <input
                  type="date"
                  value={dates.checkOut}
                  min={dates.checkIn || today}
                  onChange={(e) =>
                    setDates({ ...dates, checkOut: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              {/* Guests */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Guests
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "Guest" : "Guests"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Availability & Action */}
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {checkingAvailability ? (
                <div className="text-sm text-gray-500">
                  Checking availability...
                </div>
              ) : isAvailable === true ? (
                <div className="text-sm text-green-600 font-medium">
                  ✅ Available
                </div>
              ) : isAvailable === false ? (
                <div className="text-sm text-red-600 font-medium">
                  ❌ Not available
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  Select dates to check availability
                </div>
              )}

              {verified ? (
                <button
                  onClick={handleBook}
                  disabled={!isAvailable || bookingLoading}
                  className={`px-6 py-2 rounded-md font-medium text-white transition ${
                    isAvailable && !bookingLoading
                      ? "bg-[#2f7003] hover:bg-[#255a02]"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {bookingLoading ? "Booking..." : "Book Now"}
                </button>
              ) : (
                <button
                  onClick={() =>
                    navigate(
                      `/login?redirect=${encodeURIComponent(
                        location.pathname + location.search
                      )}`
                    )
                  }
                  className="px-6 py-2 bg-[#2f7003] text-white rounded-md font-medium hover:bg-[#255a02] transition"
                >
                  Sign In to Book
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
