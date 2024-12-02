import { useState } from "react";
import { ChevronIcon } from "../../../assets/icons";
import { useCylinderCover } from "../../../../hooks/cylinderCover";
import dateFormat from 'dateformat';
import { fullscreenClass } from "../../../styles/home";
import { CloseRounded } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

// const useRecentHistory = () => {
//   const location = useLocation();
//   const [history, setHistory] = useState([]);

//   useEffect(() => {
//     const dummyData = [
//       {
//         eccId: "T-12345",
//         status: "Storage",
//         date: new Date().toLocaleDateString(),
//       },
//       {
//         eccId: "T-12346",
//         status: "Disassembly",
//         date: new Date().toLocaleDateString(),
//       },
//       {
//         eccId: "T-12347",
//         status: "LMD",
//         date: new Date().toLocaleDateString(),
//       },
//       {
//         eccId: "T-12348",
//         status: "Inspection",
//         date: new Date().toLocaleDateString(),
//       },
//       {
//         eccId: "T-12349",
//         status: "Packing",
//         date: new Date().toLocaleDateString(),
//       },
//       {
//         eccId: "T-12350",
//         status: "Shipping",
//         date: new Date().toLocaleDateString(),
//       },
//     ];

//     setHistory(dummyData);
//   }, [location]);

//   return history;
// };

const HistorySummary = () => {
  const {cylinder} = useCylinderCover();
  const history = cylinder?.data;
  const [showAll, setShowAll] = useState(false); // State to track if showing all entries
  const {t} = useTranslation("common")

  // Determine which entries to display
  const displayedHistory = showAll ? history : history?.slice(0, 5);


  return (
     <div
      className={`w-full p-2 overflow-hidden z-20 ${
        history?.length > 5 && !showAll ? "" : fullscreenClass
      }`}
    >
       {showAll && (
        <button
          onClick={() => setShowAll(false)}
          className="absolute top-4 right-4 p-2 text-gray rounded-full"
        >
          <CloseRounded />
        </button>
      )}
      <div className="py-4 px-0">
        <div className="flex flex-row justify-between px-1 mb-2">
          <label className="px-1 py-2 font-semibold">{t("common:recentHistory")}</label>
          {history?.length > 5 &&
            !showAll && ( // Show button if there are more than 5 items
              <button
                className=" px-2 py-2 flex  text-white "
                onClick={() => setShowAll(true)}
              >
                <ChevronIcon />
              </button>
            )}
        </div>
        <ul>
          {displayedHistory?.map((item, index) => (
            <li className="py-2 flex flex-col border-t-0.5" key={index}>
              <p className="p-2 font-semibold">{item.serialNumber}</p>
              <div className="px-2 flex flex-row justify-between text-sm">
                <p>{item.status}</p>
                <p>{dateFormat(item.createdAt, "mmmm dS, yyyy")}</p>
              </div>
            </li>
          ))}
        </ul>
        {/* {history.length > 5 &&
          !showAll && ( // Show button if there are more than 5 items
            <button
              className="mt-2 px-4 py-2 text-white bg-blue-500 rounded"
              onClick={() => setShowAll(true)}
            >
              Show More
            </button>
          )} */}
      </div>
    </div>
  );
};

export default HistorySummary;
