// CityHotelsPage.jsx
import { useParams } from "react-router-dom";

const CityHotelsPage = () => {
  const { city } = useParams();
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">
        Hotels in {city.charAt(0).toUpperCase() + city.slice(1)}
      </h1>
      <p>Coming soon — hotels list for {city}!</p>
    </div>
  );
};

export default CityHotelsPage;
