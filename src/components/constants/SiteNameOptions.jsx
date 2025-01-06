import React, { useState } from "react";
import { FaChevronRight } from "react-icons/fa6";
import { useLocationProcess } from "../../hooks/locationProcess";
import { useTranslation } from "react-i18next";
import SiteNameOptionsSkeleton from "./skeleton/SiteNameOptions";

const SiteNameOptions = ({ site, setSite, disabled }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { siteData, isSiteLoading } = useLocationProcess();
  const { t } = useTranslation();

  // Ensure `siteData` is properly structured
  const siteList = siteData?.data || []; // Fallback to an empty array if undefined
  console.log(siteList);
  // Group site names by the first letter
  const groupedNames = siteList.reduce((acc, name) => {
    const firstLetter = name.name?.charAt(0).toUpperCase();
    if (!firstLetter) return acc; // Skip if name or firstLetter is undefined
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(name);
    return acc;
  }, {});

  // Filter grouped names based on search term
  const filteredGroupedNames = groupedNames
    ? Object.keys(groupedNames)
        .sort()
        .reduce((acc, letter) => {
          const filteredNames = groupedNames[letter].filter((name) =>
            name.name?.toLowerCase().includes(searchTerm.toLowerCase())
          );
          if (filteredNames.length > 0) {
            acc[letter] = filteredNames;
          }
          return acc;
        }, {})
    : {};

  // If search term exists, flatten the filtered names
  const searchResults = searchTerm
    ? siteList.filter((name) =>
        name.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleSelectName = (name) => {
    setSite(name);
    setSearchTerm("");
    setIsModalOpen(false);
  };

  return (
    <div className="w-full flex flex-col mt-2 ">
      <div className="relative w-full ">
        <label>
          {t("qrScanner:siteName")} <strong className="text-red-500">*</strong>
        </label>
        <input
          className="border w-full py-2 px-2 rounded"
          type="text"
          placeholder={t("qrScanner:selectaSite")}
          value={site}
          readOnly
          onClick={() => setIsModalOpen(true)}
          disabled={disabled}
        />
        <button
          className="absolute mt-3 right-2 top-1/2 transform -translate-y-1/2"
          onClick={() => setIsModalOpen(true)}
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          {/* Modal Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <button
              className="text-gray-500"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>

          {/* Search Input */}
          <div className="p-4">
            <input
              className="border w-full p-2 rounded"
              type="text"
              placeholder="Search site names"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Vertical List */}
          <div className="flex-1 overflow-y-auto p-4">
            {searchTerm ? (
              <ul className="space-y-2">
                {searchResults.length > 0 ? (
                  searchResults.map((name) => (
                    <li
                      key={name.id}
                      className="cursor-pointer hover:bg-cyan-100"
                      onClick={() => handleSelectName(name.name)}
                    >
                      {name.name}
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">No results found</p>
                )}
              </ul>
            ) : isSiteLoading ? (
              <SiteNameOptionsSkeleton />
            ) : (
              Object.keys(filteredGroupedNames).map((letter) => (
                <div key={letter} className="mb-4">
                  <h3 className="text-lg font-bold">{letter}</h3>
                  <ul className="ml-4 space-y-2">
                    {filteredGroupedNames[letter].map((name) => (
                      <li
                        key={name.id}
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSelectName(name.name)}
                      >
                        {name.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteNameOptions;
