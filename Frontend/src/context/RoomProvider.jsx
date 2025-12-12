import { createContext } from "react";
import axios from "axios";

export const RoomContext = createContext();

const RoomProvider = ({ children }) => {
//   const createRoom = async (formdata) => {
//     const res = await axios.post("");
//     try {
//     } catch (error) {
//       console.log(error);
//       toast.error("Failed to create room", {
//         style: {
//           borderRadius: "10px",
//           background: "#FFB5B5",
//           color: "#333",
//         },
//       });
//       return false;
//     }
//   };

  return <RoomContext.Provider>{children}</RoomContext.Provider>;
};

export default RoomProvider;
