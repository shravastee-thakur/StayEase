import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [verified, setVerified] = useState(false);
  const [role, setRole] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const refreshTokenHandler = async () => {
      try {
        const res = await axios.post(
          "https://stayease-yu78.onrender.com/api/v1/users/refreshHandler",
          {},
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          setAccessToken(res.data.accessToken);
          setVerified(res.data.user.verified);
          setUserId(res.data.user.id);
          setRole(res.data.user.role);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
        } else {
          console.error("Error during refresh token check:", error);
        }
      } finally {
        setAuthLoading(false);
      }
    };

    refreshTokenHandler();
  }, []);

  const loginStepOne = async (formData) => {
    try {
      const res = await axios.post(
        "https://stayease-yu78.onrender.com/api/v1/users/loginStepOne",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
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
        setUserId(res.data.userId);
        return true;
      }
    } catch (error) {
      console.log(error);
      toast.error("Invalid email or password", {
        style: {
          borderRadius: "10px",
          background: "#FFB5B5",
          color: "#333",
        },
      });
      return false;
    }
  };

  const verifyLoginOtp = async (otp) => {
    try {
      const res = await axios.post(
        "https://stayease-yu78.onrender.com/api/v1/users/verifyOtp",
        { userId, otp },
        {
          headers: {
            "Content-Type": "application/json",
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
        setVerified(res.data.user.verified);
        setRole(res.data.user.role);
        setAccessToken(res.data.accessToken);
        return true;
      }
    } catch (error) {
      console.log(error);
      toast.error("Invalid otp", {
        style: {
          borderRadius: "10px",
          background: "#FFB5B5",
          color: "#333",
        },
      });
      return false;
    }
  };

  const logout = async () => {
    if (!accessToken) return;
    try {
      const res = await axios.post(
        "https://stayease-yu78.onrender.com/api/v1/users/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setUserId(null);
        setAccessToken(null);
        setVerified(false);
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
      toast.error("Failed to logout", {
        style: {
          borderRadius: "10px",
          background: "#FFB5B5",
          color: "#333",
        },
      });
      return false;
    }
  };

  return (
    <div>
      <AuthContext.Provider
        value={{
          loginStepOne,
          verifyLoginOtp,
          verified,
          logout,
          userId,
          accessToken,
          role,
          authLoading,
        }}
      >
        {children}
      </AuthContext.Provider>
    </div>
  );
};

export default AuthProvider;
