// src/pages/AdminHotels.jsx
import React, { useState, useRef, useContext } from "react";
import { HotelContext } from "../../context/HotelProvider";

const AdminHotels = () => {
  const { createHotel } = useContext(HotelContext);

  const [hotels, setHotels] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentHotel, setCurrentHotel] = useState(null); // null = create mode, object = edit mode
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    address: "",
    distance: "",
    description: "",
    price: "",
  });

  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  // Open modal for CREATE
  const openCreateModal = () => {
    setCurrentHotel(null);
    setFormData({
      name: "",
      city: "",
      address: "",
      distance: "",
      description: "",
    });
    setImage(null);
    setIsModalOpen(true);
  };

  // Open modal for EDIT
  const openEditModal = (hotel) => {
    setCurrentHotel(hotel);
    setFormData({
      name: hotel.name,
      city: hotel.city,
      address: hotel.address,
      distance: hotel.distance,
      description: hotel.description,
    });
    setImage(hotel.photos[0] || null);
    setIsModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Remove an image
  const removeImage = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // Save hotel (create or update)
  const handleSave = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("name", formData.name);
    data.append("city", formData.city);
    data.append("address", formData.address);
    data.append("distance", formData.distance);
    data.append("description", formData.description);

    // Append image if exists
    if (image) {
      data.append("image", image);
    }

    if (currentHotel) {
      // Update
      setHotels((prev) =>
        prev.map((h) =>
          h.id === currentHotel.id
            ? { ...currentHotel, ...formData, photos }
            : h
        )
      );
    } else {
      try {
        await createHotel(data);
        setIsModalOpen(false);
        setFormData({
          name: "",
          city: "",
          address: "",
          distance: "",
          description: "",
        });
        setImage(null);
      } catch (error) {
        console.error("Error creating hotel:", error);
      }
    }
  };

  // Delete hotel
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this hotel?")) {
      setHotels((prev) => prev.filter((h) => h.id !== id));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Hotels</h1>
        <button
          onClick={openCreateModal}
          className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl hover:bg-blue-700 shadow-md"
        >
          +
        </button>
      </div>

      {/* Hotels List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
          >
            {hotel.photos[0] && (
              <img
                src={hotel.photos[0]}
                alt={hotel.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-800">{hotel.name}</h3>
              <p className="text-sm text-gray-600">{hotel.city}</p>
              <p className="text-sm text-gray-500 mt-1">{hotel.type}</p>
              <p className="text-green-600 font-semibold mt-2">
                ₹{hotel.cheapestPrice}/night
              </p>
              <div className="flex justify-end space-x-2 mt-3">
                <button
                  onClick={() => openEditModal(hotel)}
                  className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(hotel.id)}
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
                {currentHotel ? "Edit Hotel" : "Add New Hotel"}
              </h2>

              {/* Form */}
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Hotel Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                  <input
                    type="text"
                    name="distance"
                    placeholder="Distance (e.g., 2.5 km from center)"
                    value={formData.distance}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    rows="3"
                  />

                  {/* Image Dropzone */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <p className="text-gray-500 mb-2">
                      {image
                        ? "Image selected: " + image.name
                        : "Upload hotel image"}
                    </p>

                    <input
                      type="file"
                      // ref={fileInputRef}
                      onChange={handleFileChange}
                      multiple
                      accept="image/*"
                      className="hidden"
                      required={!currentHotel}
                    />
                    {/* <div className="mt-3 flex flex-wrap gap-2">
                      {image.map((url, index) => (
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
                    </div> */}
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
                    Save Hotel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHotels;
