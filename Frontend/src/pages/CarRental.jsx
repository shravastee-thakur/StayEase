import { useNavigate } from "react-router-dom";

const CarRental = () => {
  const navigate = useNavigate();

  const handleProceed = () => {
    window.open(
      "https://shra-driveaway.netlify.app/",
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleCancel = () => {
    navigate("/"); // Redirects to home page
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-md w-full text-center">
        {/* <div className="mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12h-6"
            />
          </svg>
        </div> */}

        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          External Redirect
        </h1>

        <p className="text-gray-600 mb-8">
          You are about to leave{" "}
          <span className="font-semibold text-[#05339C]">StayEase</span> and be
          redirected to a third-party car rental service.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleCancel}
            className="px-5 py-2.5 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleProceed}
            className="px-5 py-2.5 rounded-lg bg-[#05339C] text-white font-medium hover:bg-[#042a7a] transition-colors focus:outline-none focus:ring-2 focus:ring-[#05339C]"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarRental;
