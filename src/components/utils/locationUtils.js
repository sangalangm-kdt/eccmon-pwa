import axios from "axios";

// Function to fetch coordinates based on a location string
export const fetchCoordinatesFromLocation = async (location, setFormData, setUserLocation, setShowMap) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${location}&addressdetails=1&limit=1`,
    );
    if (response.data && response.data[0]) {
      const { lat, lon, display_name, address } = response.data[0];
      setFormData((prevData) => ({
        ...prevData,
        location: display_name,
        city: address.city || "",
        country: address.country || "",
      }));
      setUserLocation({ latitude: lat, longitude: lon });
      setShowMap(true);
    }
  } catch (error) {
    console.error("Error fetching coordinates", error);
  }
};

// Function to get the current location (geolocation)
export const getGeolocation = (setFormData, setUserLocation, setShowMap) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      setFormData((prevData) => ({
        ...prevData,
        location: "Your current location", // Optional: Change this as needed
        city: "",
        country: "",
      }));
      setUserLocation({ latitude, longitude });
      setShowMap(true);
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
};

// Function to fetch location suggestions based on user input
export const getLocationSuggestions = async (query, setLocationSuggestions) => {
  if (query) {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&addressdetails=1&limit=5`,
      );
      setLocationSuggestions(response.data); // Set the nearby locations as suggestions
    } catch (error) {
      console.error("Error fetching location suggestions", error);
    }
  }
};

// Function to handle map click event and update the location
export const handleMapClick = async (e, setFormData, setUserLocation, setShowMap) => {
  const { lat, lng } = e.latlng;
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
    );
    const location = response.data.display_name || "Unknown Location";
    const city = response.data.address.city || "Unknown City";
    const country = response.data.address.country || "Unknown Country";

    setFormData((prevData) => ({
      ...prevData,
      location: location,
      city: city,
      country: country,
    }));

    setUserLocation({ latitude: lat, longitude: lng }); // Update user's location
    setShowMap(false);
  } catch (error) {
    console.error("Error fetching location data", error);
  }
};
