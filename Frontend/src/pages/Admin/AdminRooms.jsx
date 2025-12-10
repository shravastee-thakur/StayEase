// src/pages/AdminRooms.jsx
import React, { useState, useRef } from "react";

const AdminRooms = () => {
  // Mock room data
  const [rooms, setRooms] = useState([
    {
      id: 1,
      type: "Deluxe Suite",
      description: "Spacious suite with ocean view and king bed.",
      price: 250,
      maxPeople: 4,
      photos: ["/placeholder.jpg"],
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null); // null = create, object = edit
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    price: "",
    maxPeople: "",
  });
  const [photos, setPhotos] = useState([]);
  const fileInputRef = useRef(null);

  // Open modal for CREATE
  const openCreateModal = () => {
    setCurrentRoom(null);
    setFormData({
      type: "",
      description: "",
      price: "",
      maxPeople: "",
    });
    setPhotos([]);
    setIsModalOpen(true);
  };

  // Open modal for EDIT
  const openEditModal = (room) => {
    setCurrentRoom(room);
    setFormData({
      type: room.type,
      description: room.description,
      price: room.price.toString(),
      maxPeople: room.maxPeople.toString(),
    });
    setPhotos(room.photos || []);
    setIsModalOpen(true);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotoUrls = files.map((file) => URL.createObjectURL(file));
    setPhotos((prev) => [...prev, ...newPhotoUrls]);
  };

  // Remove image preview
  const removeImage = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // Save (create or update)
  const handleSave = () => {
    const newRoomData = {
      ...formData,
      price: Number(formData.price),
      maxPeople: Number(formData.maxPeople),
      photos: [...photos],
    };

    if (currentRoom) {
      // Update
      setRooms((prev) =>
        prev.map((r) =>
          r.id === currentRoom.id ? { ...r, ...newRoomData } : r
        )
      );
    } else {
      // Create
      const newRoom = {
        id: Date.now(),
        ...newRoomData,
      };
      setRooms((prev) => [...prev, newRoom]);
    }
    setIsModalOpen(false);
  };

  // Delete room
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      setRooms((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Rooms</h1>
        <button
          onClick={openCreateModal}
          className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl hover:bg-blue-700 shadow-md"
        >
          +
        </button>
      </div>

      {/* Rooms List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
          >
            {room.photos[0] && (
              <img
                src={room.photos[0]}
                alt={room.type}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-800">{room.type}</h3>
              <p className="text-sm text-gray-600 mt-1">
                ₹{room.price} / night
              </p>
              <p className="text-sm text-gray-500">
                Max: {room.maxPeople} people
              </p>
              <p className="text-gray-700 text-sm mt-2 line-clamp-2">
                {room.description}
              </p>
              <div className="flex justify-end space-x-2 mt-3">
                <button
                  onClick={() => openEditModal(room)}
                  className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(room.id)}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                {currentRoom ? "Edit Room" : "Add New Room"}
              </h2>

              <div className="space-y-4">
                <input
                  type="text"
                  name="type"
                  placeholder="Room Type (e.g., Deluxe Suite)"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />

                <textarea
                  name="description"
                  placeholder="Room Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  rows="3"
                  required
                />

                <input
                  type="number"
                  name="price"
                  placeholder="Price per Night (₹)"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  min="0"
                  required
                />

                <input
                  type="number"
                  name="maxPeople"
                  placeholder="Max Occupancy (e.g., 2, 4)"
                  value={formData.maxPeople}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  min="1"
                  required
                />

                {/* Image Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <p className="text-gray-600 mb-2">Upload Photos</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-600 hover:underline"
                  >
                    Click to upload or drag and drop
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {photos.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`preview-${index}`}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Room
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRooms;
