/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { TextInput, RegisterSelection } from "../../constants/TextInput";
import {
  IoArrowBack,
  IoArrowForwardOutline,
  IoLogInOutline,
} from "react-icons/io5";
import { Link } from "react-router-dom";
import { useUserRequest } from "../../../hooks/user-request";
import { useLocation } from "../../../hooks/location";
import AccountRequestModal from "../../constants/AccountRequestModal";

const AccountRequestForm = () => {
  const { register } = useUserRequest();
  const { t } = useTranslation("common");
  const { affiliation } = useLocation();

  const [formData, setFormData] = useState({
    userId: "",
    firstName: "",
    lastName: "",
    affiliation: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [result, setResult] = useState("");

  const affiliationOptions = affiliation?.map((aff) => ({
    value: aff.name,
    label: aff.name,
  }));

  const handleSelectChange = (selectedOption, name) => {
    setFormData({
      ...formData,
      [name]: selectedOption ? selectedOption.value : "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (errors[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (name === "password" && value && value.length < 8) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: t("reqAcc.enterPassword"),
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

    if (!formData.firstName)
      validationErrors.firstName = t("reqAccValidation.firstName");
    if (!formData.lastName)
      validationErrors.lastName = t("reqAccValidation.lastName");
    if (!formData.userId)
      validationErrors.userId = t("reqAccValidation.employeeId");
    if (!formData.affiliation)
      validationErrors.affiliation = t("reqAccValidation.affiliation");
    if (!formData.email) validationErrors.email = t("reqAccValidation.email");
    if (!formData.password)
      validationErrors.password = t("reqAccValidation.password");

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const requestResult = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        affiliation: formData.affiliation,
        email: formData.email,
        password: formData.password,
        isApprove: 0,
        userId: formData.userId.trim(),
      });

      const requestStatus = requestResult.isSuccess ? "success" : "fail";
      setResult(requestStatus);

      if (requestStatus === "success") {
        setFormData({
          userId: "",
          firstName: "",
          lastName: "",
          affiliation: "",
          email: "",
          password: "",
        });
        setStep(1);
      }

      setMessage(requestResult.message);
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    const validationErrors = {};

    if (step === 1) {
      if (!formData.firstName)
        validationErrors.firstName = t("reqAccValidation.firstName");
      if (!formData.lastName)
        validationErrors.lastName = t("reqAccValidation.lastName");
      if (!formData.userId)
        validationErrors.userId = t("reqAccValidation.employeeId");
    }

    if (step === 2) {
      if (!formData.affiliation)
        validationErrors.affiliation = t("reqAccValidation.affiliation");
      if (!formData.email) validationErrors.email = t("reqAccValidation.email");
      if (!formData.password)
        validationErrors.password = t("reqAccValidation.password");
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setStep((prevStep) => Math.min(prevStep + 1, 3));
  };

  const prevStep = () => setStep((prevStep) => Math.max(prevStep - 1, 1));

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 dark:bg-gray-700 xs:bg-white lg:bg-secondary">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm gap-1 rounded bg-white p-8 text-sm shadow-md xs:bg-none xs:shadow-none dark:xs:bg-transparent"
      >
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-700 dark:text-gray-50">
          {t("reqAcc.requestAccount")}
        </h2>
        <div className="mb-4 text-center text-xs text-gray-500 dark:text-gray-200">
          {t("reqAcc.fillOutFields")}
        </div>

        <div className="mb-4 flex justify-between text-xs text-gray-500 dark:text-gray-100">
          <div
            className={`w-1/3 ${step === 1 ? "font-medium text-primary" : ""}`}
          >
            {t("reqAcc.personalInfo")}
          </div>
          <div
            className={`w-1/3 ${step === 2 ? "font-medium text-primary" : ""}`}
          >
            {t("reqAcc.workInfo")}
          </div>
          <div
            className={`w-1/3 ${step === 3 ? "font-medium text-primary" : ""}`}
          >
            {t("reqAcc.review")}
          </div>
        </div>

        <div className="mb-4 h-1 bg-gray-300">
          <div
            className={`h-full bg-cyan-to-blue`}
            style={{ width: `${(step - 1) * 33.33}%` }}
          />
        </div>

        {step === 1 && (
          <>
            <div className="mb-4 flex flex-col gap-2 text-sm">
              <TextInput
                label={t("reqAcc.firstName")}
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder={t("reqAcc.enterFirstName")}
                error={errors.firstName}
              />
              <TextInput
                label={t("reqAcc.lastName")}
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                placeholder={t("reqAcc.enterLastName")}
                error={errors.lastName}
              />
              <TextInput
                label={t("reqAcc.employeeNumber")}
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                placeholder={t("reqAcc.enterEmployeeNumber")}
                error={errors.userId}
              />
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center gap-2 rounded bg-cyan-to-blue px-4 py-3 font-medium text-white"
              >
                <span>{t("reqAcc.next")}</span>
                <IoArrowForwardOutline />
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="mb-4">
              <RegisterSelection
                label={t("reqAcc.affiliation")}
                fieldName="affiliation"
                options={affiliationOptions}
                value={formData.affiliation}
                onChange={handleSelectChange}
                placeholder={t("reqAcc.enterAffiliation")}
                error={errors.affiliation}
              />
              <TextInput
                label={t("reqAcc.email")}
                type="email"
                name="email"
                placeholder={t("reqAcc.enterEmail")}
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
              <TextInput
                label={t("reqAcc.password")}
                type="password"
                name="password"
                placeholder={t("reqAcc.enterPassword")}
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
              />
            </div>

            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center gap-2 border border-cyanToBlue px-4 py-3 text-gray-600"
              >
                <IoArrowBack />
                <span>{t("reqAcc.back")}</span>
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center gap-2 bg-cyan-to-blue px-4 py-3 text-white"
              >
                <span>{t("reqAcc.next")}</span>
                <IoArrowForwardOutline />
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="mb-6">
              <p className="mb-4 text-center text-lg font-semibold">
                {t("reqAcc.reviewYourInformation")}
              </p>
              <div className="rounded-xl border p-6 text-gray-900 dark:text-gray-200">
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold">
                      {t("reqAcc.employeeNumber")}:
                    </span>{" "}
                    {formData.userId}
                  </p>
                  <p>
                    <span className="font-semibold">
                      {t("reqAcc.firstName")}:
                    </span>{" "}
                    {formData.firstName}
                  </p>
                  <p>
                    <span className="font-semibold">
                      {t("reqAcc.lastName")}:
                    </span>{" "}
                    {formData.lastName}
                  </p>
                  <p>
                    <span className="font-semibold">
                      {t("reqAcc.affiliation")}:
                    </span>{" "}
                    {formData.affiliation}
                  </p>
                  <p>
                    <span className="font-semibold">{t("reqAcc.email")}:</span>{" "}
                    {formData.email}
                  </p>
                  <p>
                    <span className="font-semibold">
                      {t("reqAcc.password")}:
                    </span>{" "}
                    ********
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center gap-2 bg-gray-100 px-4 py-3"
              >
                <IoArrowBack />
                <span>{t("reqAcc.back")}</span>
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center gap-2 bg-cyan-to-blue px-4 py-3 text-white ${
                  isSubmitting ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                <span>{t("reqAcc.requestNow")}</span>
              </button>
            </div>
          </>
        )}
      </form>

      <div className="mt-4 flex-col text-center">
        <Link to="/login">
          <button
            type="button"
            name="back-to-login"
            className="inline-flex items-center gap-2 border p-3 text-gray-600 dark:text-gray-100"
          >
            <IoLogInOutline size={25} />
          </button>
        </Link>
        <span className="flex p-4 text-sm text-gray-600 dark:text-white">
          {t("reqAcc.goToLogin")}
        </span>
      </div>

      <AccountRequestModal
        result={result}
        onClose={() => setResult("")}
        message={message}
      />
    </div>
  );
};

export default AccountRequestForm;
