/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import L from "leaflet"; // Import Leaflet for map integration
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import {
  TextInput,
  EmailInput,
  LocationInput,
  PasswordInput,
} from "../../constants/TextInput"; // Keep your custom input components
import {
  IoArrowBack,
  IoArrowForwardOutline,
  IoLogIn,
  IoLogInOutline,
  IoReturnDownBackOutline,
} from "react-icons/io5";
import { Link } from "react-router-dom";

const AccountRequestForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    location: "",
    city: "",
    country: "",
    email: "",
    password: "",
    affiliation: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userLocation, setUserLocation] = useState(null); // Store user's location (latitude and longitude)
  const [showMap, setShowMap] = useState(false); // Track whether map should be shown or hidden
  const [locationSuggestions, setLocationSuggestions] = useState([]); // Store nearby location suggestions
  const [step, setStep] = useState(1); // Track the current step
  const [affiliationOptions] = useState([
    { value: "System", label: "System" },
    { value: "Engineering", label: "Engineering" },
    { value: "Marketing", label: "Marketing" },
    { value: "Sales", label: "Sales" },
  ]);

  const handleAffiliationChange = (selectedOption) => {
    setFormData({
      ...formData,
      affiliation: selectedOption ? selectedOption.value : "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "location" && value) {
      // Fetch location suggestions when user types in the location field
      getLocationSuggestions(value);
    } else {
      // Clear suggestions when the input is empty
      setLocationSuggestions([]);
    }
  };

  // Fetch the location based on geolocation or manual input
  const getLocation = () => {
    if (formData.location) {
      // If location is manually entered, fetch the coordinates using OpenStreetMap
      fetchCoordinatesFromLocation(formData.location);
    } else if (navigator.geolocation) {
      // Fallback to geolocation if no manual location
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

  // Function to fetch coordinates based on a location string
  const fetchCoordinatesFromLocation = async (location) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${location}&addressdetails=1&limit=1`,
      );
      if (response.data && response.data[0]) {
        const { lat, lon, display_name, address } = response.data[0];
        setFormData({
          ...formData,
          location: display_name,
          city: address.city || "",
          country: address.country || "",
        });
        setUserLocation({ latitude: lat, longitude: lon });
        setShowMap(true);
      }
    } catch (error) {
      console.error("Error fetching coordinates", error);
    }
  };

  // Toggle map visibility when the map icon is clicked
  const toggleMapVisibility = () => {
    if (formData.location) {
      // If a manual location is entered, fetch its coordinates
      getLocation();
    } else if (showMap) {
      setShowMap(false);
    } else {
      getLocation(); // Trigger the map display and fetch location if the map is not open
    }
  };

  // Fetch location suggestions based on user input
  const getLocationSuggestions = async (query) => {
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

  // Select a location from suggestions
  const handleLocationSelect = (suggestion) => {
    setFormData({
      ...formData,
      location: suggestion.display_name,
      city: suggestion.address.city || "",
      country: suggestion.address.country || "",
    });
    setLocationSuggestions([]); // Clear suggestions after selection
    setUserLocation({
      latitude: suggestion.lat,
      longitude: suggestion.lon,
    }); // Set the selected location as userLocation
    setShowMap(false); // Close the map after selecting a location
  };

  useEffect(() => {
    if (showMap && userLocation) {
      const { latitude, longitude } = userLocation;
      const map = L.map("map").setView([latitude, longitude], 12);

      // Use OpenStreetMap's default tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
        map,
      );

      const marker = L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup("You are here!");

      // Add click listener to the map to update the location
      map.on("click", async (e) => {
        const { lat, lng } = e.latlng;

        // Fetch the location details from OpenStreetMap
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
          );
          const location = response.data.display_name || "Unknown Location";
          const city = response.data.address.city || "Unknown City";
          const country = response.data.address.country || "Unknown Country";

          // Update the form with the new location data
          setFormData((prevData) => ({
            ...prevData,
            location: location,
            city: city,
            country: country,
          }));

          setUserLocation({ latitude: lat, longitude: lng }); // Update user's location

          // Close the map after location change
          setShowMap(false);
        } catch (error) {
          console.error("Error fetching location data", error);
        }
      });

      return () => {
        map.remove();
      };
    }
  }, [showMap, userLocation]); // Trigger map rendering when map visibility or userLocation changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = {};

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    setErrors({});

    try {
      // Send request to backend
      await axios.post("/api/account-requests", formData);
      alert("Your account request has been submitted successfully.");
      setFormData({
        firstName: "",
        lastName: "",
        location: "",
        city: "",
        country: "",
        email: "",
        password: "",
      });
      setStep(1); // Reset to the first step after successful submission
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle navigation between steps
  const nextStep = () => setStep((prevStep) => Math.min(prevStep + 1, 3));
  const prevStep = () => setStep((prevStep) => Math.max(prevStep - 1, 1));

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 xs:bg-white lg:bg-secondary">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm gap-1 rounded bg-white p-8 text-sm shadow-md xs:shadow-none"
      >
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-700">
          Request an Account
        </h2>
        <div className="mb-4 text-center text-xs text-gray-500">
          Please fill out the fields below
        </div>

        {/* Progress Bar */}
        <div className="mb-4 flex justify-between text-xs text-gray-500">
          <div
            className={`w-1/3 ${step === 1 ? "font-medium text-primary" : ""}`}
          >
            Personal Info
          </div>
          <div
            className={`w-1/3 ${step === 2 ? "font-medium text-primary" : ""}`}
          >
            Work Info
          </div>
          <div
            className={`w-1/3 ${step === 3 ? "font-medium text-primary" : ""}`}
          >
            Review
          </div>
        </div>
        <div className="mb-4 h-1 bg-gray-300">
          <div
            className={`h-full bg-cyan-to-blue`}
            style={{ width: `${(step - 1) * 33.33}%` }} // Dynamic progress width
          />
        </div>

        {/* Step 1 - Personal Information */}
        {step === 1 && (
          <>
            <div>
              <div className="mb-4 flex flex-col gap-2 text-sm">
                <TextInput
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  error={errors.firstName}
                />
                <TextInput
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  error={errors.lastName}
                />
              </div>
            </div>

            <LocationInput
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              error={errors.location}
              onLocationClick={toggleMapVisibility}
              locationSuggestions={locationSuggestions}
              onLocationSelect={handleLocationSelect}
            />

            {showMap && userLocation && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                onClick={() => setShowMap(false)} // Close map when clicking outside of it
              >
                <div
                  className="rounded bg-white p-4 shadow-lg"
                  style={{ width: "80%", maxWidth: "600px", height: "80%" }}
                  onClick={(e) => e.stopPropagation()} // Prevent map from closing when clicking inside the modal
                >
                  <div id="map" style={{ height: "100%" }} />
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center gap-2 rounded bg-cyan-to-blue px-4 py-3 font-medium text-white hover:bg-primary focus:outline-none"
              >
                <span>Next</span>
                <IoArrowForwardOutline /> {/* Right arrow icon */}
              </button>
            </div>
          </>
        )}

        {/* Step 2 - Work Information */}
        {step === 2 && (
          <>
            <div className="mb-4">
              <div className="mb-4">
                {" "}
                <label className="font-semibold text-primaryText">
                  Affiliation
                </label>
                <Select
                  options={affiliationOptions}
                  value={affiliationOptions.find(
                    (option) => option.value === formData.affiliation,
                  )}
                  onChange={handleAffiliationChange}
                />
              </div>
              <EmailInput
                label="Email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />

              <PasswordInput
                label="Password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
              />
              <TextInput
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter City"
                error={errors.city}
              />

              <TextInput
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Enter country"
                error={errors.country}
              />
            </div>

            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="border-cyanToBlue inline-flex items-center gap-2 rounded border bg-white px-4 py-3 font-medium text-gray-600 hover:bg-primary focus:outline-none"
              >
                <IoArrowBack /> {/* Left arrow icon */}
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center gap-2 rounded bg-cyan-to-blue px-4 py-3 font-medium text-white hover:bg-primary focus:outline-none"
              >
                <span>Next</span>
                <IoArrowForwardOutline />
              </button>
            </div>
          </>
        )}

        {/* Step 3 - Review */}
        {step === 3 && (
          <>
            <div className="mb-4">
              <p className="font-semibold">Review your information:</p>
              <div>
                <p>
                  <strong>First Name:</strong> {formData.firstName}
                </p>
                <p>
                  <strong>Last Name:</strong> {formData.lastName}
                </p>
                <p>
                  <strong>Location:</strong> {formData.location}
                </p>
                <p>
                  <strong>Email:</strong> {formData.email}
                </p>
                <p>
                  <strong>Affiliation:</strong> {formData.affiliation}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center gap-2 rounded border bg-gray-100 px-4 py-3 font-medium text-gray-600 hover:bg-primary focus:outline-none"
              >
                <IoArrowBack /> {/* Left arrow icon */}
                <span>Back</span>
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center gap-2 rounded bg-cyan-to-blue px-4 py-3 font-medium text-white hover:bg-primary focus:outline-none ${
                  isSubmitting ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                <span>Request now</span>
              </button>
            </div>
          </>
        )}
      </form>
      <div className="mt-4 flex-col text-center">
        <Link to="/login">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border bg-gray-50 p-3 font-medium text-gray-600 hover:bg-primary focus:outline-none"
          >
            <IoLogInOutline size={25} className="font-normal" />
          </button>
        </Link>
        <span className="flex p-4 text-sm text-gray-600">Go to Login</span>
      </div>
    </div>
  );
};

export default AccountRequestForm;
