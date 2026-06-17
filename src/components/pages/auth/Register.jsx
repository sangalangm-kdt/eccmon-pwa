import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { TextInput, RegisterSelection } from "../../constants/TextInput";
import { IoArrowBack, IoArrowForwardOutline, IoCheckmark } from "react-icons/io5";
import { Link, useLocation as useRouterLocation } from "react-router-dom";
import { useUserRequest } from "../../../hooks/user-request";
import { useLocation } from "../../../hooks/location";
import AccountRequestModal from "../../constants/AccountRequestModal";
import GuestAppChrome from "../../constants/GuestAppChrome";
import { getValidationErrorKey } from "../../utils/authErrors";

const primaryButtonClassName =
  "ecc-touch-btn inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-cyan-to-blue px-4 py-3 text-base font-semibold text-white transition-all hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[8.5rem]";

const secondaryButtonClassName =
  "ecc-touch-btn inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800/60 dark:text-gray-200 dark:hover:bg-gray-700 sm:w-auto sm:min-w-[7.5rem]";

const StepIndicator = ({ steps, currentStep }) => {
  const progress =
    steps.length > 1 ? ((currentStep - 1) / (steps.length - 1)) * 100 : 0;

  return (
    <div className="mb-5">
      <div className="flex items-start justify-between gap-1 sm:gap-2">
        {steps.map((stepItem) => {
          const isActive = currentStep === stepItem.id;
          const isComplete = currentStep > stepItem.id;

          return (
            <div
              key={stepItem.id}
              className="flex min-w-0 flex-1 flex-col items-center"
            >
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors sm:size-9 ${
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : isComplete
                      ? "bg-primary/15 text-primary dark:bg-primary/25"
                      : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                }`}
              >
                {isComplete ? (
                  <IoCheckmark className="size-4 sm:size-5" aria-hidden="true" />
                ) : (
                  stepItem.id
                )}
              </div>
              <span
                className={`mt-1.5 line-clamp-2 text-center text-[10px] leading-tight sm:text-xs ${
                  isActive
                    ? "font-semibold text-primary"
                    : isComplete
                      ? "font-medium text-gray-600 dark:text-gray-300"
                      : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {stepItem.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="h-full rounded-full bg-cyan-to-blue transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

const AccountRequestForm = () => {
  const { register } = useUserRequest();
  const { t, i18n } = useTranslation(["common", "login"]);
  const { affiliation } = useLocation();
  const routeLocation = useRouterLocation();

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
  const [messageKey, setMessageKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [result, setResult] = useState("");

  const affiliationOptions = useMemo(() => {
    const list = Array.isArray(affiliation)
      ? affiliation
      : affiliation?.data ?? [];

    return list
      .map((aff) => {
        const name = aff?.name ?? aff?.location ?? aff?.affiliation ?? "";
        return name ? { value: name, label: name } : null;
      })
      .filter(Boolean);
  }, [affiliation]);

  useEffect(() => {
    console.log("affiliation:", affiliation);
    console.log("affiliationOptions:", affiliationOptions);
  }, [affiliation, affiliationOptions]);

  const steps = useMemo(
    () => [
      { id: 1, label: t("reqAcc.personalInfo") },
      { id: 2, label: t("reqAcc.workInfo") },
      { id: 3, label: t("reqAcc.review") },
    ],
    [t, i18n.language],
  );

  useEffect(() => {
    setErrors({});
    setMessage("");
    setMessageKey("");
    setResult("");
  }, [routeLocation.pathname, i18n.language]);

  const handleSelectChange = (selectedOption, name) => {
    setFormData({
      ...formData,
      [name]: selectedOption ? selectedOption.value : "",
    });
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[name];
      return newErrors;
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
        password: "common:authErrors.passwordTooShort",
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
    setErrors({});
    setMessage("");
    setMessageKey("");

    const validationErrors = {};

    ["firstName", "lastName", "userId", "affiliation", "email", "password"].forEach(
      (field) => {
        const errorKey = getValidationErrorKey(field, formData[field]);
        if (errorKey) validationErrors[field] = errorKey;
      },
    );

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
      setMessageKey(requestResult.messageKey || "");

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

      setMessage(requestResult.message || "");
    } catch (error) {
      setResult("fail");
      setMessageKey("common:authErrors.server");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    const validationErrors = {};

    if (step === 1) {
      ["firstName", "lastName", "userId"].forEach((field) => {
        const errorKey = getValidationErrorKey(field, formData[field]);
        if (errorKey) validationErrors[field] = errorKey;
      });
    }

    if (step === 2) {
      ["affiliation", "email", "password"].forEach((field) => {
        const errorKey = getValidationErrorKey(field, formData[field]);
        if (errorKey) validationErrors[field] = errorKey;
      });
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
    <GuestAppChrome className="justify-start overflow-y-auto py-4 md:justify-center md:py-6">
      <div className="w-full max-w-[32rem]">
        <div className="border-none bg-transparent p-0 shadow-none md:rounded-2xl md:border md:border-gray-200/90 md:bg-white/95 md:p-8 md:shadow-xl md:shadow-gray-300/25 md:backdrop-blur-sm dark:md:border-gray-600/80 dark:md:bg-gray-800/95 dark:md:shadow-black/30">
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4 text-center md:mb-5">
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-50 md:text-2xl">
                {t("reqAcc.requestAccount")}
              </h1>
              <p className="mt-1.5 text-sm leading-snug text-gray-600 dark:text-gray-300">
                {t("reqAcc.fillOutFields")}
              </p>
            </div>

            <StepIndicator steps={steps} currentStep={step} />

            {step === 1 && (
              <>
                <div className="space-y-0">
                  <TextInput
                    variant="auth"
                    label={t("reqAcc.firstName")}
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder={t("reqAcc.enterFirstName")}
                    error={errors.firstName ? t(errors.firstName) : ""}
                  />
                  <TextInput
                    variant="auth"
                    label={t("reqAcc.lastName")}
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder={t("reqAcc.enterLastName")}
                    error={errors.lastName ? t(errors.lastName) : ""}
                  />
                  <TextInput
                    variant="auth"
                    label={t("reqAcc.employeeNumber")}
                    type="text"
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                    placeholder={t("reqAcc.enterEmployeeNumber")}
                    error={errors.userId ? t(errors.userId) : ""}
                  />
                </div>

                <div className="mt-5 flex justify-stretch sm:justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    className={primaryButtonClassName}
                  >
                    <span>{t("reqAcc.next")}</span>
                    <IoArrowForwardOutline aria-hidden="true" />
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-0">
                  <RegisterSelection
                    variant="auth"
                    label={t("reqAcc.affiliation")}
                    fieldName="affiliation"
                    options={affiliationOptions}
                    value={formData.affiliation}
                    onChange={handleSelectChange}
                    placeholder={t("reqAcc.enterAffiliation")}
                    error={errors.affiliation ? t(errors.affiliation) : ""}
                  />
                  <TextInput
                    variant="auth"
                    label={t("reqAcc.email")}
                    type="email"
                    name="email"
                    placeholder={t("reqAcc.enterEmail")}
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email ? t(errors.email) : ""}
                  />
                  <TextInput
                    variant="auth"
                    label={t("reqAcc.password")}
                    type="password"
                    name="password"
                    placeholder={t("reqAcc.enterPassword")}
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password ? t(errors.password) : ""}
                  />
                </div>

                <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className={secondaryButtonClassName}
                  >
                    <IoArrowBack aria-hidden="true" />
                    <span>{t("reqAcc.back")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className={primaryButtonClassName}
                  >
                    <span>{t("reqAcc.next")}</span>
                    <IoArrowForwardOutline aria-hidden="true" />
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="mb-4">
                  <p className="mb-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-100 sm:text-base">
                    {t("reqAcc.reviewYourInformation")}
                  </p>
                  <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-4 text-sm text-gray-800 dark:border-gray-600 dark:bg-gray-900/40 dark:text-gray-200 sm:p-5">
                    <dl className="space-y-2.5">
                      {[
                        ["userId", t("reqAcc.employeeNumber")],
                        ["firstName", t("reqAcc.firstName")],
                        ["lastName", t("reqAcc.lastName")],
                        ["affiliation", t("reqAcc.affiliation")],
                        ["email", t("reqAcc.email")],
                      ].map(([key, label]) => (
                        <div key={key} className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                          <dt className="font-semibold sm:min-w-[8.5rem]">{label}</dt>
                          <dd className="text-gray-700 dark:text-gray-300">
                            {formData[key]}
                          </dd>
                        </div>
                      ))}
                      <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                        <dt className="font-semibold sm:min-w-[8.5rem]">
                          {t("reqAcc.password")}
                        </dt>
                        <dd className="text-gray-700 dark:text-gray-300">********</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className={secondaryButtonClassName}
                    disabled={isSubmitting}
                  >
                    <IoArrowBack aria-hidden="true" />
                    <span>{t("reqAcc.back")}</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={primaryButtonClassName}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        <span>{t("reqAcc.submitting")}</span>
                      </>
                    ) : (
                      <span>{t("reqAcc.requestNow")}</span>
                    )}
                  </button>
                </div>
              </>
            )}
          </form>

          <p className="mt-5 text-center text-sm text-gray-600 dark:text-gray-300">
            {t("reqAcc.alreadyHaveAccount")}
            <Link
              to="/login"
              className="font-semibold text-primary hover:underline"
            >
              {t("reqAcc.signIn")}
            </Link>
          </p>
        </div>

        <p className="mt-4 text-center text-[11px] leading-relaxed text-gray-400 dark:text-gray-500 sm:mt-5">
          {t("login:kawasakiCopyright")}
        </p>
      </div>

      <AccountRequestModal
        result={result}
        onClose={() => setResult("")}
        message={message}
        messageKey={messageKey}
      />
    </GuestAppChrome>
  );
};

export default AccountRequestForm;
