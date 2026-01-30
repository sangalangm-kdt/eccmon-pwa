/* eslint-disable no-unused-vars */
import React, { useCallback, useMemo, useState } from "react";
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

const INITIAL_FORM = {
  userId: "",
  firstName: "",
  lastName: "",
  affiliation: "",
  email: "",
  password: "",
};

const AccountRequestForm = () => {
  const { register } = useUserRequest();
  const { t } = useTranslation("common");
  const { affiliation } = useLocation();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(""); // "success" | "fail" | ""
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const affiliationOptions = useMemo(() => {
    return (affiliation ?? []).map((aff) => ({
      value: aff.name,
      label: aff.name,
    }));
  }, [affiliation]);

  // ✅ Progress: step 1 = 33%, step 2 = 66%, step 3 = 100%
  const progressPercent = useMemo(() => {
    return Math.round((step / 3) * 100);
  }, [step]);

  const clearFieldError = useCallback((name) => {
    setErrors((prev) => {
      if (!prev?.[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const handleSelectChange = useCallback(
    (selectedOption, name) => {
      clearFieldError(name);
      setFormData((prev) => ({
        ...prev,
        [name]: selectedOption ? selectedOption.value : "",
      }));
    },
    [clearFieldError],
  );

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      clearFieldError(name);

      // password quick inline check
      if (name === "password" && value && value.length < 8) {
        setErrors((prev) => ({
          ...prev,
          password: t("reqAccValidation.password"), // keep your validation key
        }));
      }

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [clearFieldError, t],
  );

  // ✅ One validation function
  const validateStep = useCallback(
    (targetStep) => {
      const v = {};

      const firstName = formData.firstName.trim();
      const lastName = formData.lastName.trim();
      const userId = formData.userId.trim();
      const affiliation = formData.affiliation.trim();
      const email = formData.email.trim();
      const password = formData.password;

      if (targetStep === 1) {
        if (!firstName) v.firstName = t("reqAccValidation.firstName");
        if (!lastName) v.lastName = t("reqAccValidation.lastName");
        if (!userId) v.userId = t("reqAccValidation.employeeId");
      }

      if (targetStep === 2) {
        if (!affiliation) v.affiliation = t("reqAccValidation.affiliation");
        if (!email) v.email = t("reqAccValidation.email");
        if (!password) v.password = t("reqAccValidation.password");
        if (password && password.length < 8)
          v.password = t("reqAccValidation.password");
      }

      // step 3: validate everything
      if (targetStep === 3) {
        if (!firstName) v.firstName = t("reqAccValidation.firstName");
        if (!lastName) v.lastName = t("reqAccValidation.lastName");
        if (!userId) v.userId = t("reqAccValidation.employeeId");
        if (!affiliation) v.affiliation = t("reqAccValidation.affiliation");
        if (!email) v.email = t("reqAccValidation.email");
        if (!password) v.password = t("reqAccValidation.password");
        if (password && password.length < 8)
          v.password = t("reqAccValidation.password");
      }

      return v;
    },
    [formData, t],
  );

  const nextStep = useCallback(() => {
    const currentErrors = validateStep(step);
    if (Object.keys(currentErrors).length) {
      setErrors(currentErrors);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, 3));
  }, [step, validateStep]);

  const prevStep = useCallback(() => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalErrors = validateStep(3);
    if (Object.keys(finalErrors).length) {
      setErrors(finalErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        affiliation: formData.affiliation.trim(),
        email: formData.email.trim(),
        password: formData.password,
        isApprove: 0,
        userId: formData.userId.trim(),
      };

      const requestResult = await register(payload);

      const requestStatus = requestResult.isSuccess ? "success" : "fail";
      setResult(requestStatus);
      setMessage(requestResult.message);

      if (requestStatus === "success") {
        setFormData(INITIAL_FORM);
        setStep(1);
      }
    } catch (error) {
      setResult("fail");
      setMessage(
        t("common:authErrors.unexpected", "An unexpected error occurred."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 dark:bg-gray-800 xs:bg-white lg:bg-secondary">
      <div className="mx-auto flex w-full max-w-md flex-col px-4 py-6 sm:px-6">
        <form
          onSubmit={handleSubmit}
          className="w-full rounded-2xl bg-white p-6 shadow-cyan-200/30 dark:border-gray-700/70 dark:bg-gray-900 dark:shadow-black/30"
        >
          <h2 className="mb-2 text-center text-2xl font-bold text-gray-800 dark:text-gray-100">
            {t("reqAcc.requestAccount")}
          </h2>

          <p className="mb-5 text-center text-xs text-gray-500 dark:text-gray-300">
            {t("reqAcc.fillOutFields")}
          </p>

          {/* Step labels */}
          <div className="mb-2 flex justify-between text-xs text-gray-500 dark:text-gray-300">
            <span className={step === 1 ? "font-semibold text-primary" : ""}>
              {t("reqAcc.personalInfo")}
            </span>
            <span className={step === 2 ? "font-semibold text-primary" : ""}>
              {t("reqAcc.workInfo")}
            </span>
            <span className={step === 3 ? "font-semibold text-primary" : ""}>
              {t("reqAcc.review")}
            </span>
          </div>

          {/* Progress */}
          <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full bg-cyan-to-blue transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <>
              <div className="flex flex-col gap-3">
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
                  className="inline-flex items-center gap-2 rounded-lg bg-cyan-to-blue px-4 py-3 text-sm font-semibold text-white"
                >
                  <span>{t("reqAcc.next")}</span>
                  <IoArrowForwardOutline />
                </button>
              </div>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <div className="flex flex-col gap-3">
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
                <p className="text-xs text-gray-500 dark:text-gray-300">
                  {t(
                    "reqAcc.passwordHint",
                    "Password must be at least 8 characters.",
                  )}
                </p>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <IoArrowBack />
                  <span>{t("reqAcc.back")}</span>
                </button>

                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center gap-2 rounded-lg bg-cyan-to-blue px-4 py-3 text-sm font-semibold text-white"
                >
                  <span>{t("reqAcc.next")}</span>
                  <IoArrowForwardOutline />
                </button>
              </div>
            </>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              <div className="mb-6">
                <p className="mb-4 text-center text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {t("reqAcc.reviewYourInformation")}
                </p>

                <div className="rounded-xl border border-gray-200 p-5 text-sm text-gray-800 dark:border-gray-700 dark:text-gray-200">
                  <div className="space-y-2">
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
                      <span className="font-semibold">
                        {t("reqAcc.email")}:
                      </span>{" "}
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
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <IoArrowBack />
                  <span>{t("reqAcc.back")}</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex items-center gap-2 rounded-lg bg-cyan-to-blue px-4 py-3 text-sm font-semibold text-white ${
                    isSubmitting ? "cursor-not-allowed opacity-60" : ""
                  }`}
                >
                  <span>{t("reqAcc.requestNow")}</span>
                </button>
              </div>
            </>
          )}
        </form>

        {/* Back to login */}
        <div className="mt-6 flex flex-col items-center justify-center text-center">
          <Link to="/login">
            <button
              type="button"
              name="back-to-login"
              className="inline-flex items-center gap-2 rounded-full border border-gray-800/70 bg-white p-3 text-gray-800 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
              aria-label={t("reqAcc.goToLogin")}
            >
              <IoLogInOutline size={24} />
            </button>
          </Link>
          <span className="mt-2 text-sm text-gray-600 dark:text-gray-200">
            {t("reqAcc.goToLogin")}
          </span>
        </div>

        <AccountRequestModal
          result={result}
          onClose={() => setResult("")}
          message={message}
        />
      </div>
    </div>
  );
};

export default AccountRequestForm;
