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
    setFormData({
      ...formData,
      [name]: value,
    });
  };

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
      register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        // location: "",
        // city: "",
        // country: "",
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
              <TextInput
                label="Employee Number"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                placeholder="Enter employee number"
                error={errors.userId}
              />
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
                  onChange={(e) => handleSelectChange(e, "affiliation")}
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

              <div className="mb-4">
                {" "}
                <label className="font-semibold text-primaryText">
                  Prefectures
                </label>
                <Select
                  options={prefectureOptions}
                  value={prefectureOptions.find(
                    (option) => option.value === formData.prefecture,
                  )}
                  onChange={(e) => {
                    handleSelectChange(e, "prefecture");
                    setPrefecture(e.value);
                  }}
                />
              </div>

              <div className="mb-4">
                {" "}
                <label className="font-semibold text-primaryText">City</label>
                <Select
                  options={cityOptions}
                  value={cityOptions.find(
                    (option) => option.value === formData.city,
                  )}
                  onChange={(e) => handleSelectChange(e, "city")}
                />
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
            <IoLogInOutline size={25} className="" />
          </button>
        </Link>
        <span className="flex p-4 text-sm text-gray-600">Go to Login</span>
      </div>
    </div>
  );
};

export default AccountRequestForm;
