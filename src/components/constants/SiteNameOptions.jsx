import { FaChevronRight } from "react-icons/fa6";
import { useLocationProcess } from "../../hooks/locationProcess";
import { useTranslation } from "react-i18next";
import SiteNameOptionsSkeleton from "./skeleton/SiteNameOptions";
import { useState } from "react";

const SiteNameOptions = ({ site, setSite, disabled, showAlert }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading } = useLocationProcess("site");
  const { t } = useTranslation();

  // Ensure `data` is properly structured
  const siteList = data?.data || []; // Fallback to an empty array if undefined

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
            name.name?.toLowerCase().includes(searchTerm.toLowerCase()),
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
        name.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : [];

  const handleSelectName = (name) => {
    setSite(name);
    setSearchTerm("");
    setIsModalOpen(false);
  };

  return (
    <div className="mt-2 flex w-full flex-col">
      <div className="relative w-full">
        <label>
          {t("qrScanner:siteName")} <strong className="text-red-500">*</strong>
        </label>
        <input
          className="w-full rounded border bg-transparent px-2 py-2 dark:bg-gray-600"
          type="text"
          placeholder={site === "None" ? t("qrScanner:selectaSite") : site}
          value={site === "None" ? "" : site}
          readOnly
          onClick={() => setIsModalOpen(true)}
          disabled={disabled}
        />

        <button
          className="absolute right-2 top-1/2 mt-3 -translate-y-1/2 transform"
          onClick={() => setIsModalOpen(true)}
        >
          <FaChevronRight />
        </button>
        {showAlert && !site && (
          <p className="text-xs text-red-600">{t("validation.siteRequired")}</p>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-gray-700">
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b p-4">
            <button
              className="text-gray-500 dark:text-gray-50"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>

          {/* Search Input */}
          <div className="p-4">
            <input
              className="w-full rounded border bg-transparent p-2"
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
            ) : isLoading ? (
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
