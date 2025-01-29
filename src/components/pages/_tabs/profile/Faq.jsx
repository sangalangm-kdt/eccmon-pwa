import React, { useEffect, useState } from "react";
import {
  IoArrowBack,
  IoChevronDown,
  IoChevronUp,
  IoSearch,
  IoHelpCircleOutline,
  IoInformationCircleOutline,
  IoSettingsOutline,
  IoLogOutOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../../../../hooks/auth";

const Faq = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user, errorMessage } = useAuthentication();

  useEffect(() => {
    if (errorMessage) {
      console.error("Authentication Error:", errorMessage);
    }
  }, [errorMessage]);

  const employeeFirstname = user?.first_name || "Unknown User";

  const handleBackToProfile = () => navigate("/profile");
  const toggleCategory = (category) => {
    setActiveCategory(activeCategory === category ? null : category);
    setActiveIndex(null);
  };
  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqCategories = {
    "General Information": [
      {
        question: "What is ECCMon?",
        answer:
          "ECCMon is a QR scanning system designed to monitor cylinder covers.",
      },
      {
        question: "What happens after scanning the QR code?",
        answer:
          "The app will display detailed information about the cylinder cover.",
      },
      {
        question:
          "What are the different types of operations in ECCMon mobile?",
        answer: (
          <>
            ECCMon mobile tracks the following operations:
            <br />- Storage Operations: Monitor cylinder covers stored within
            the system.
            <br />- Process Operations: Track cylinder covers undergoing
            production or remanufacturing processes.
            <br />- Mounted Operations: Keep track of cylinder covers that have
            been mounted.
            <br />- Dismounted Operations: Monitor cylinder covers that have
            been dismounted.
            <br />- Disposal Operations: Manage records of disposed cylinder
            covers.
          </>
        ),
      },
    ],
    "Getting Started": [
      {
        question: "How do I get started with ECCMon?",
        answer: "Install the PWA, sign in, and start scanning QR codes.",
      },
      {
        question: "How do I scan a cylinder cover's QR code?",
        answer: "Tap 'Scan QR' and point your camera at the QR code.",
      },
    ],
    Operations: [
      {
        question: "How do I add a new cylinder cover?",
        answer: "Scan the QR code or enter the serial number manually.",
      },
      {
        question: "How do I update an existing cylinder cover?",
        answer: "Scan the QR code and select the desired operation.",
      },
    ],
    "Account & Settings": [
      {
        question: "Can I change the language in the app?",
        answer: "Yes, go to Settings and select your preferred language.",
      },
      {
        question: "How can I log out of the app?",
        answer: "Tap the 'Logout' button in the sidebar.",
      },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col bg-cyan-50">
      <div className="fixed flex w-full items-center justify-center bg-white py-6 shadow-md dark:bg-gray-700">
        <button
          onClick={handleBackToProfile}
          className="flex items-center gap-1 p-2"
        >
          <IoArrowBack className="text-gray-700 dark:text-gray-100" />
          <p className="text-sm text-gray-700 dark:text-gray-100">Back</p>
        </button>
        <h1 className="flex-1 text-center text-sm font-medium text-gray-700 dark:text-gray-100">
          Frequently Asked Questions (FAQ)
        </h1>
      </div>

      <div className="mt-28 text-center text-gray-600 dark:text-gray-300">
        <p className="text-gray-500">
          Hello{" "}
          <strong className="font-semibold text-primary">
            {employeeFirstname}
          </strong>
          , how can we help you?
        </p>
      </div>

      <div className="m-4 px-6">
        <div className="relative">
          <input
            type="text"
            className="w-full rounded-lg border py-2 pl-2 focus:outline-none dark:bg-gray-600 dark:text-gray-100"
            placeholder="Search for a question"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <IoSearch
            size={20}
            className="absolute right-3 top-1/2 -translate-y-1/2 transform text-primary dark:text-gray-100"
          />
        </div>
      </div>
      <div>
        {" "}
        <div className="m-4 flex flex-col gap-2 p-1 text-sm dark:bg-gray-700">
          {Object.entries(faqCategories).map(([category, items]) => (
            <div
              key={category}
              className="flex flex-col rounded-lg border border-gray-200 bg-white dark:border-gray-600"
            >
              <button
                className="w-full px-6 py-4 text-left text-lg font-medium"
                onClick={() => toggleCategory(category)}
              >
                {category}
              </button>
              {activeCategory === category && (
                <div>
                  {items
                    .filter((item) =>
                      item.question
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()),
                    )
                    .map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col dark:border-gray-600"
                      >
                        <button
                          className="flex w-full flex-row items-center justify-between px-6 py-3 text-left"
                          onClick={() => toggleAccordion(index)}
                        >
                          <div className="flex items-center gap-3">
                            {item.icon}
                            <h2>{item.question}</h2>
                          </div>
                          {activeIndex === index ? (
                            <IoChevronUp />
                          ) : (
                            <IoChevronDown />
                          )}
                        </button>
                        {activeIndex === index && (
                          <p className="px-6 py-3">{item.answer}</p>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;
