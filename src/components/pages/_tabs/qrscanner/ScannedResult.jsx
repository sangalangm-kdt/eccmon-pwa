/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import ScanCodes from "./ScanCodes";
import SaveButton from "../../../constants/SaveButton";
import { CylinderInfo, QrHeader } from "./components";
import { useCylinderUpdate } from "../../../../hooks/cylinderUpdates";
import { useNavigate } from "react-router-dom";

const ScannedResult = () => {
  const [selectedStatus, setSelectedStatus] = useState("None");
  const [data, setData] = useState({});
  const { addUpdate } = useCylinderUpdate();
  const [step, setStep] = useState("view");
  const navigate = useNavigate();

  // useEffect(() => {
  //   setSelectedStatus(cylinder.status);
  // }, [cylinder])
  const handleClick = (e) => {
    e.preventDefault();
    console.log(data, selectedStatus);
    if (step === "view") {
      setStep("review");
    } else if (step === "review") {
      console.log(data, selectedStatus);
      addUpdate(data, selectedStatus);
      navigate("/qrscanner");
      setData({});
    } else if (step === "edit") {
      addUpdate(data, selectedStatus);
      setStep("view");
    }
  };

  const handleEdit = () => {
    setStep("edit");
  };

  useEffect(() => {
    console.log(data, selectedStatus);
  }, [data]);

  return (
    <div>
      <div className="flex flex-col w-full bg-gray-100">
        <QrHeader step={step} handleEdit={handleEdit} />
        {step === "review" && (
          <div className="flex flex-col w-full mt-24  py-2rounded-lg ">
            <div className="bg-white m-4 m">
              <p className=" flex font-semibold text-base twext-white">
                Review information
              </p>
              <p className="flex text-xs text-gray-500">
                Is the information you submitted is correct?
              </p>
            </div>
          </div>
        )}
        <ScanCodes
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          disabled={step === "review"}
          step={step}
        />
        <div className="mt-2">
          <CylinderInfo
            selectedStatus={selectedStatus}
            setData={setData}
            disabled={step === "review"}
            step={step}
          />
        </div>
        <SaveButton
          onClick={handleClick}
          text={step === "review" ? "Save" : "Continue"}
        />
      </div>
    </div>
  );
};

export default ScannedResult;
