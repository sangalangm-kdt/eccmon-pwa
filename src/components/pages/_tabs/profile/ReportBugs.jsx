import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { BsTextareaResize } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";
import { LuUpload } from "react-icons/lu";
import { useReportBug } from "../../../../hooks/report-bug";
import { useAuthentication } from "../../../../hooks/auth";

const ReportBugs = () => {
  const bugCategories = [
    "Functional",
    "Visual",
    "Content",
    "Security",
    "Compatibility",
    "Usability",
    "Others",
  ];

  const navigate = useNavigate();
  const { t } = useTranslation("reportBugs");
  const handleBackToProfile = () => navigate("/profile");
  const { addReportBug } = useReportBug();
  const { userId } = useAuthentication();

  const [isFocused, setIsFocused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [reason, setReason] = useState("");
  const [images, setImages] = useState([]);
  const textareaRef = useRef(null);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter((file) =>
      [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/tiff",
        "image/webp",
      ].includes(file.type),
    );

    // Generate URLs only once and store them in state
    const imageURLs = imageFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prevImages) => [...prevImages, ...imageURLs]);
  };

  const handleDelete = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    try {
      //send to backend na to
      console.log(`Bug Title: ${title}`);
      console.log(`Reason: ${reason}`);
      console.log(`Images: ${images}`);
    } catch (error) {
      console.log(`Error: ${error}`);
    } finally {
      setTitle("");
      setReason("");
      setImages([]);
    }
    console.log("Form submitted!");
  };

  const handleDownload = () => {
    addReportBug({ userId, title, category, reason, files: images });
  };

  console.log(images);
  return (
    <div className="flex min-h-screen flex-col justify-between">
      {/* Header */}
      <div className="fixed z-10 flex w-full items-center justify-center rounded-b-xl bg-white py-6 shadow-md dark:bg-gray-700">
        <button
          onClick={handleBackToProfile}
          className="flex items-center justify-center gap-1 rounded-full p-2"
        >
          <IoArrowBack className="text-gray-700 dark:text-gray-100" />
          <p className="text-sm text-gray-700 dark:text-gray-100">Back</p>
        </button>
        <h1 className="flex-1 text-center font-medium text-gray-700 dark:text-gray-100 xs:mr-12">
          {t("reportBugsTitle")}
        </h1>
      </div>

      {/* Content */}
      <div className="m-4 mt-28 flex flex-grow flex-col gap-4 rounded bg-gray-50 p-6 px-4 text-sm dark:bg-gray-700">
        <h1 className="mb-2 text-center text-xl font-semibold text-gray-800 dark:text-white">
          {t("reportABug")}
        </h1>

        <form
          onSubmit={handleFormSubmit}
          className="flex flex-grow flex-col gap-4 px-4 text-sm"
        >
          {/* Bug Title Field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-gray-600 dark:text-gray-50">
              {t("bugTitle")}
              <span className="text-red-500">&nbsp;*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="bug-title"
                name="title"
                className="w-full gap-2 rounded border p-2 text-gray-700 outline-none focus:border-0.5 focus:border-primary dark:border-gray-400 dark:bg-gray-800 dark:text-gray-100"
                placeholder={t("enterBugTitle")}
                required
                autoComplete="false"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          {/* Category Field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-gray-600 dark:text-gray-50">
              Category
              <span className="text-red-500">&nbsp;*</span>
            </label>
            <div className="relative">
              <select
                name="category"
                id="category"
                className="w-full gap-2 rounded border p-2 text-gray-700 outline-none focus:border-0.5 focus:border-primary dark:border-gray-400 dark:bg-gray-800 dark:text-gray-100"
                required
                autoComplete="false"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {bugCategories.map((category, categoryIdx) => (
                  <option key={categoryIdx} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* What Went Wrong Field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="reason" className="text-gray-600 dark:text-gray-50">
              {t("reason")}
              <span className="text-red-500">&nbsp;*</span>
            </label>
            <div className="relative">
              <textarea
                ref={textareaRef}
                type="textarea"
                id="reason"
                name="reason"
                className={`${isExpanded ? "h-52" : ""} w-full resize-none rounded border p-2 outline-none focus:border-0.5 focus:border-primary dark:border-gray-400 dark:bg-gray-800 dark:text-gray-100`}
                placeholder={t("whatWentWrong")}
                rows={5}
                required
                onFocus={handleFocus}
                onBlur={handleBlur}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <BsTextareaResize
                className={`absolute bottom-2 right-1 cursor-pointer ${isFocused ? "fill-primary dark:fill-gray-400" : "fill-gray-400"}`}
                onClick={() => {
                  setIsExpanded(!isExpanded);
                }}
              />
            </div>
          </div>

          {/* Upload Field */}
          <div className="">
            <label
              htmlFor="confirmNewPassword"
              className="text-gray-600 dark:text-gray-50"
            >
              {t("uploadSupportingDocument")}
            </label>
            <ul id="uploadList" className="my-4 grid grid-cols-3 gap-3">
              {images.map(({ url }, index) => (
                <li key={index} className="relative">
                  <img
                    src={url}
                    alt={`upload-${index}`}
                    className="h-24 w-24 rounded object-cover"
                  />
                  <button
                    className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-red-500 p-1 text-white"
                    onClick={() => handleDelete(index)}
                  >
                    <FaTimes className="h-2 w-2" />
                  </button>
                </li>
              ))}
            </ul>
            <input
              type="file"
              id="fileUpload"
              accept=".png, .jpg, .jpeg, .tiff, .webp"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="text-center">
              <label
                htmlFor="fileUpload"
                className="inline-flex cursor-pointer items-center gap-2 rounded bg-orange-400 px-4 py-2 text-white"
              >
                <LuUpload />
                {t("selectFiles")}
              </label>
            </div>
          </div>

          {/* Report Button at the Bottom */}
          <div className="mb-10 mt-auto">
            <button
              type="button"
              onClick={handleDownload}
              // type="submit"
              className="hover:bg-primary-dark w-full rounded bg-cyan-to-blue py-4 text-white focus:bg-cyan-to-blue-active focus:outline-none"
            >
              {t("reportBtn")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportBugs;
