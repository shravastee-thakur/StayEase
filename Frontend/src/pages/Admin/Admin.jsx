import { useState } from "react";
import AdminRooms from "./AdminRooms";
import AdminHotels from "./AdminHotels";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("hotels"); // 'hotels' or 'rooms'

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("hotels")}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
              activeTab === "hotels"
                ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Manage Hotels
          </button>
          <button
            onClick={() => setActiveTab("rooms")}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg ml-2 ${
              activeTab === "rooms"
                ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Manage Rooms
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          {activeTab === "hotels" && <AdminHotels />}
          {activeTab === "rooms" && <AdminRooms />}
        </div>
      </div>
    </div>
  );
};

export default Admin;
