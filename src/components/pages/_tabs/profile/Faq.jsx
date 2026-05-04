import React, { useState, useRef } from "react";
import {
  IoArrowBack,
  IoChevronDown,
  IoChevronUp,
  IoSearch,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../../../../hooks/auth";

const Faq = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuthentication();
  const faqSectionRefs = useRef([]);

  const employeeFirstname = user?.first_name || "Unknown User";

  const handleBackToProfile = () => navigate("/profile");

  const toggleCategory = (category) => {
    setActiveCategory(activeCategory === category ? null : category);
    setActiveIndex(null); // Reset the index when changing categories
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
        question: "What is ECCMon Mobile?",
        answer:
          "ECCMon Mobile is the progressive web app (PWA) version of ECCMon. It aims ro  ",
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
        answer: "Tap the 'Logout' button in the profile section.",
      },
    ],
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredQuestions([]);
      setActiveCategory(null);
      setActiveIndex(null);
      return;
    }

    const matchedQuestions = Object.values(faqCategories)
      .flat()
      .filter((item) =>
        item.question.toLowerCase().includes(query.toLowerCase()),
      );

    setFilteredQuestions(matchedQuestions);
    setActiveCategory(null);
    setActiveIndex(null);
  };

  const handleQuestionClick = (index, category) => {
    setActiveCategory(category);
    setActiveIndex(index);

    // Reset filtered questions after clicking a question
    setFilteredQuestions([]);

    const element = faqSectionRefs.current[`${category}-${index}`];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    setSearchQuery(""); // Optionally clear the search query
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-800">
      <div className="fixed flex w-full items-center justify-center rounded-b-xl bg-white py-6 shadow-md dark:bg-gray-700">
        <button
          onClick={handleBackToProfile}
          className="flex items-center gap-1 p-2"
        >
          <IoArrowBack className="text-gray-700 dark:text-gray-100" />
          <p className="text-sm text-gray-700 dark:text-gray-100">Back</p>
        </button>
        <h1 className="flex-1 text-center text-sm font-medium text-gray-700 dark:text-gray-100 xs:mr-14">
          FAQ
        </h1>
      </div>

      <div className="mt-28 flex flex-col text-center text-cyan-600 dark:text-gray-100">
        <p className="mb-2 text-2xl font-semibold">
          Frequently Asked Questions
        </p>
        <hr className="mx-auto my-2 w-48 border-t-3 border-cyanToBlue" />
        <p className="mt-2 text-sm font-medium text-gray-500">
          Hello{" "}
          <strong className="font-semibold text-primary">
            {employeeFirstname}
          </strong>
          , how can we help you?
        </p>
      </div>

      <div className="m-2 px-3">
        <div className="relative">
          <input
            type="text"
            className="w-full rounded-lg border py-3 pl-2 text-sm focus:outline-none dark:bg-gray-600 dark:text-gray-100"
            placeholder="Search for a question"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <IoSearch
            size={20}
            className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-600 dark:text-gray-100"
          />
        </div>
        <ul>
          {filteredQuestions.map((item, index) => {
            const category = Object.keys(faqCategories).find((key) =>
              faqCategories[key].some(
                (question) => question.question === item.question,
              ),
            );
            return (
              <li
                key={index}
                className="cursor-pointer bg-white px-4 py-2 hover:bg-cyan-100 dark:bg-gray-500 dark:hover:bg-gray-600"
                onClick={() => handleQuestionClick(index, category)}
              >
                <p>{item.question}</p>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="m-4 flex flex-col gap-2 p-1 text-sm dark:bg-gray-800">
        {Object.entries(faqCategories).map(([category, items]) => (
          <div
            key={category}
            className="flex flex-col rounded-lg border border-gray-200 bg-white dark:border-gray-500 dark:bg-gray-500"
          >
            <button
              className="w-full px-6 py-4 text-left text-md font-medium text-gray-600 dark:text-gray-100"
              onClick={() => toggleCategory(category)}
            >
              {category}
            </button>
            {activeCategory === category && (
              <div>
                {items.map((item, index) => (
                  <div
                    key={index}
                    ref={(el) =>
                      (faqSectionRefs.current[`${category}-${index}`] = el)
                    }
                    className="flex flex-col dark:border-gray-600"
                  >
                    <button
                      className="flex w-full flex-row items-center justify-between px-6 py-3 text-left dark:bg-gray-600"
                      onClick={() => toggleAccordion(index)}
                    >
                      <div className="flex items-center gap-3">
                        <h2>{item.question}</h2>
                      </div>
                      {activeIndex === index ? (
                        <IoChevronUp size={22} />
                      ) : (
                        <IoChevronDown size={22} />
                      )}
                    </button>
                    {activeIndex === index && (
                      <p className="px-6 py-3 dark:bg-gray-700">
                        {item.answer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
