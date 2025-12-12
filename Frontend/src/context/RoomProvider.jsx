import { createContext, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthProvider";
import { HotelContext } from "./HotelProvider";
import toast from "react-hot-toast";

export const RoomContext = createContext();

const RoomProvider = ({ children }) => {
  const { accessToken } = useContext(AuthContext);
  const { hotelId } = useContext(HotelContext);

  const createRoom = async (formdata) => {
    console.log("hotelId", hotelId);
    console.log("formdata", formdata);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/room/createRoom",
        formdata,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      console.log(res.data);
      if (res.data.success) {
        toast.success(res.data.message, {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        return true;
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to create room", {
        style: {
          borderRadius: "10px",
          background: "#FFB5B5",
          color: "#333",
        },
      });
      return false;
    }
  };

  const fetchRooms = async (hotelId) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/hotel/getHotelRooms/${hotelId}/rooms`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(res.data);
      if (res.data.success) {
        return res.data.rooms;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteRoom = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/room/deleteRoom/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message, {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        return true;
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete room", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      return false;
    }
  };

  return (
    <RoomContext.Provider value={{ createRoom, fetchRooms, deleteRoom }}>
      {children}
    </RoomContext.Provider>
  );
};

export default RoomProvider;
