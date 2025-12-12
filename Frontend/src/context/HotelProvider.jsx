import { createContext, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthProvider";

export const HotelContext = createContext();

const HotelProvider = ({ children }) => {
  const { accessToken } = useContext(AuthContext);

  const createHotel = async (formData) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/hotel/createHotel",
        formData,
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
            background: "#C5FF95",
            color: "#333",
          },
        });
        return true;
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to create hotel", {
        style: {
          borderRadius: "10px",
          background: "#FFB5B5",
          color: "#333",
        },
      });
      return false;
    }
  };

  const fetchHotels = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/hotel/getHotels",
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        return res.data.hotels;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteHotel = async (id) => {
    console.log(id);

    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/hotel/deleteHotel/${id}`,
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
      toast.error("Failed to delete hotel", {
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
    <HotelContext.Provider value={{ createHotel, fetchHotels, deleteHotel }}>
      {children}
    </HotelContext.Provider>
  );
};

export default HotelProvider;
