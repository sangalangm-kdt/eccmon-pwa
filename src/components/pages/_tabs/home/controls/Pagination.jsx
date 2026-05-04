import React from "react";
import Select from "react-select";
import { IoArrowBackOutline, IoArrowForwardOutline } from "react-icons/io5";
import { customSelectStyle } from "../../../../utils/selectUtils";

const Pagination = ({
  perPageOptions,
  perPage,
  handlePerPageChange,
  currentPage,
  totalPages,
  handlePrevPage,
  handleNextPage,
  isDarkMode,
}) => {
  return (
    <div className="mb-2 mt-2 flex justify-between">
      <div className="flex flex-row items-center justify-center gap-1">
        <label>Show</label>
        <Select
          className="w-20 text-center text-xs"
          options={perPageOptions}
          value={perPageOptions.find((option) => option.value === perPage)}
          onChange={handlePerPageChange}
          styles={customSelectStyle(isDarkMode)}
        />
        <label>entries</label>
      </div>

      <div className="flex items-center justify-center gap-1">
        <button
          className="rounded border p-2"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          <IoArrowBackOutline />
        </button>
        <p className="flex items-center justify-center">
          Page {currentPage} of {totalPages}
        </p>
        <button
          className="rounded border p-2"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          <IoArrowForwardOutline />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
