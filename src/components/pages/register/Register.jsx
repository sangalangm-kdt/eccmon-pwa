/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import L from "leaflet"; // Import Leaflet for map integration
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import { TextInput, RegisterSelection } from "../../constants/TextInput"; // Keep your custom input components
import {
  IoArrowBack,
  IoArrowForwardOutline,
  IoLogIn,
  IoLogInOutline,
  IoReturnDownBackOutline,
} from "react-icons/io5";
import { Link } from "react-router-dom";
import { japan } from "../../../data/japan";
import { useUserRequest } from "../../../hooks/user-request";

const AccountRequestForm = () => {
  const { register } = useUserRequest();

  const [formData, setFormData] = useState({
    userId: "",
    firstName: "",
    lastName: "",
    // prefecture: "",
    // city: "",
    email: "",
    password: "",
    // affiliation: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userLocation, setUserLocation] = useState(null); // Store user's location (latitude and longitude)
  const [showMap, setShowMap] = useState(false); // Track whether map should be shown or hidden
  const [locationSuggestions, setLocationSuggestions] = useState([]); // Store nearby location suggestions
  const [step, setStep] = useState(1); // Track the current step
  const affiliationOptions = [
    { value: "Association", label: "Association" },
    { value: "Company", label: "Company" },
    { value: "Group", label: "Group" },
    { value: "Network", label: "Network" },
    { value: "Organization", label: "Organization" },
  ];
  const prefectureOptions = japan.prefectures.map((prefecture) => ({
    value: prefecture.name,
    label: prefecture.name,
  }));
  const [prefecture, setPrefecture] = useState("");
  const cityOptions = prefecture
    ? japan.prefectures
        .filter((pref) => pref.name === prefecture)[0]
        .cities.map((city) => ({
          value: city.name,
          label: city.name,
        }))
    : [];

  const handleSelectChange = (selectedOption, name) => {
    setFormData({
      ...formData,
      [name]: selectedOption ? selectedOption.value : "",
    });

    console.log(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear the error for the field being typed in
    if (errors[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name]; // Remove the error for the specific field
        return newErrors;
      });
    }

    // Email domain validation
    if (name === "email" && value && !value.endsWith("@global.kawasaki.com")) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Email must be a @global.kawasaki.com address",
      }));
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = {};

    if (step === 1) {
      // Validate step 1 fields
      if (!formData.firstName)
        validationErrors.firstName = "First name is required";
      if (!formData.lastName)
        validationErrors.lastName = "Last name is required";
      if (!formData.userId)
        validationErrors.userId = "Employee number is required";
    }

    if (step === 2) {
      // Validate step 2 fields
      if (!formData.affiliation)
        validationErrors.affiliation = "Affiliation is required";
      if (!formData.email) validationErrors.email = "Email is required";
      if (!formData.password)
        validationErrors.password = "Password is required";
      if (!formData.prefecture)
        validationErrors.prefecture = "Prefecture is required";
      if (!formData.city) validationErrors.city = "City is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    setErrors({});

    try {
      // Send request to backend
      register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        // location: "",
        city: formData.city,

        email: formData.email,
        password: formData.password,
        isApprove: 2,
        userId: formData.userId,
      });
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
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle navigation between steps
  const nextStep = () => {
    const validationErrors = {};

    if (step === 1) {
      if (!formData.firstName)
        validationErrors.firstName = "First name is required";
      if (!formData.lastName)
        validationErrors.lastName = "Last name is required";
      if (!formData.userId)
        validationErrors.userId = "Employee number is required";
    }

    if (step === 2) {
      if (!formData.affiliation)
        validationErrors.affiliation = "Affiliation is required";
      if (!formData.email) validationErrors.email = "Email is required";
      if (!formData.password)
        validationErrors.password = "Password is required";
      if (!formData.prefecture)
        validationErrors.prefecture = "Prefecture is required";
      if (!formData.city) validationErrors.city = "City is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Don't move to next step if there are validation errors
    }

    setErrors({});
    setStep((prevStep) => Math.min(prevStep + 1, 3));
  };

  const prevStep = () => setStep((prevStep) => Math.max(prevStep - 1, 1));

  const isDarkMode = document.documentElement.classList.contains("dark");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 dark:bg-gray-700 xs:bg-white lg:bg-secondary">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm gap-1 rounded bg-white p-8 text-sm shadow-md xs:bg-none xs:shadow-none dark:xs:bg-transparent"
      >
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-700 dark:text-gray-50">
          Request an Account
        </h2>
        <div className="mb-4 text-center text-xs text-gray-500 dark:text-gray-200">
          Please fill out the fields below
        </div>

        {/* Progress Bar */}
        <div className="mb-4 flex justify-between text-xs text-gray-500 dark:text-gray-100">
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
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  error={errors.firstName}
                />
                <TextInput
                  label="Last Name"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  error={errors.lastName}
                />{" "}
                <TextInput
                  label="Employee Number"
                  type="text"
                  name="userId"
                  value={formData.userId.trim()}
                  onChange={handleChange}
                  placeholder="Enter employee number"
                  error={errors.userId}
                />
              </div>
            </div>

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
              <RegisterSelection
                label="Affiliation"
                fieldName="affiliation"
                options={affiliationOptions}
                value={formData.affiliation}
                onChange={handleSelectChange}
                placeholder="Select affiliation"
                error={errors.affiliation}
              />
              <TextInput
                label="Email"
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />

              <TextInput
                label="Password"
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
              />

              <RegisterSelection
                label="Prefectures"
                fieldName="prefectures"
                options={prefectureOptions}
                value={formData.prefecture}
                onChange={handleSelectChange}
                placeholder="Select prefectures"
                error={errors.prefecture}
              />

              <RegisterSelection
                label="City"
                fieldName="city"
                options={cityOptions}
                value={formData.city}
                onChange={handleSelectChange}
                placeholder="Select city"
                error={errors.city}
              />
            </div>

            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center gap-2 rounded border border-cyanToBlue bg-white px-4 py-3 font-medium text-gray-600 hover:bg-primary focus:outline-none"
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
                  <strong>Location:</strong> {formData.city}
                  {", "}
                  {formData.prefecture}
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
