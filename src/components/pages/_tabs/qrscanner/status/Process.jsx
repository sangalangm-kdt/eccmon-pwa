/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import LocationDropdown from "../../../../constants/LocationDropdown";
import DateField from "../../../../constants/DateField";
import ButtonYesOrNo from "../../../../constants/ButtonYesOrNo";
import Cycle from "../../../../constants/Cycle";
import OrderNo from "../../../../constants/OrderNo";
import { useLocationProcess } from "../../../../../hooks/locationProcess";
import CaseButton from "../../../../constants/CaseButton";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Import useTranslation for translations
import ProcessSkeleton from "../../../../constants/skeleton/Process";

const Process = ({ selectedProcessorStatus, setData, disabled }) => {
    const location = useLocation();
    const cylinderData = location.state?.data;
    const { t } = useTranslation("qrScanner"); // Use the correct namespace
    const [selectedCase, setSelectedCase] = useState(cylinderData?.case); // Initially null, means no case selected
    const [processor, setProcessor] = useState(cylinderData?.location);
    const [date, setDate] = useState(() => {
        const today = cylinderData?.updates?.dateDone
            ? new Date(cylinderData?.updates?.dateDone)
            : new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        const hours = String(today.getHours()).padStart(2, "0");
        const minutes = String(today.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}`; // Return full dateTime
    });
    const [passed, setPassed] = useState(
        cylinderData?.updates?.otherDetails?.isPassed
    );
    const [cycle, setCycle] = useState(cylinderData?.cycle);
    const [selectedOrderNo, setSelectedOrderNo] = useState(
        cylinderData?.updates?.otherDetails?.orderNumber
    );

    const {
        disassembly,
        isDisassemblyLoading,
        disassemblyMutate,

        grooving,
        isGroovingLoading,
        groovingMutate,

        lmd,
        isLmdLoading,
        lmdMutate,

        finishing,
        isFinishingLoading,
        finishingMutate,

        assembly,
        isAssemblyLoading,
        assemblyMutate,
    } = useLocationProcess();

    useEffect(() => {
        setSelectedCase(
            selectedProcessorStatus === cylinderData.status
                ? cylinderData.case
                : null
        );
        setProcessor(
            selectedProcessorStatus === cylinderData.status
                ? cylinderData.location
                : ""
        );
        setDate(() => {
            const today =
                selectedProcessorStatus === cylinderData.status &&
                cylinderData.updates.dateDone
                    ? new Date(cylinderData.updates.dateDone)
                    : new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, "0");
            const day = String(today.getDate()).padStart(2, "0");
            const hours = String(today.getHours()).padStart(2, "0");
            const minutes = String(today.getMinutes()).padStart(2, "0");
            return `${year}-${month}-${day}T${hours}:${minutes}`; // Return full dateTime
        });
        setPassed(
            selectedProcessorStatus === cylinderData.status
                ? cylinderData?.updates?.otherDetails?.isPassed
                : 0
        );
        setSelectedOrderNo(
            selectedProcessorStatus === cylinderData.status
                ? cylinderData?.updates?.otherDetails.orderNumber
                : ""
        );
    }, [selectedProcessorStatus]);

    useEffect(() => {
        setData({
            serialNumber: cylinderData?.serialNumber,
            location: processor,
            dateDone: date,
            cycle: cycle,
            otherDetails: `{"case" : "${selectedCase}", "isPassed" : "${passed}", "orderNumber" : "${selectedOrderNo}"}`,
        });
    }, [processor, date, passed, cycle, selectedOrderNo, selectedCase]);

    // Function to render different locations based on selectedProcessorStatus
    const renderLocations = () => {
        const locationOptions = {
            disassembly: disassembly?.data,
            assembly: assembly?.data,
            finishing: finishing?.data,
            grooving: grooving?.data,
            lmd: lmd?.data,
        };

        console.log("Selected Processor Status:", selectedProcessorStatus);
        console.log("Location Options:", locationOptions);

        // Check if selectedProcessorStatus exists in the options
        const currentOptions = locationOptions[
            selectedProcessorStatus?.toLowerCase()
        ]?.filter(
            (item) => item.status !== 2 // You can adjust this filter condition if necessary
        );

        console.log("Current Options:", currentOptions);

        return currentOptions ? (
            <div>
                <CaseButton
                    selectedCase={selectedCase}
                    setSelectedCase={setSelectedCase}
                    disabled={disabled}
                />
                <label className="text-sm text-primaryText font-semibold mt-2">
                    {t("qrScanner:processor")}
                </label>
                <LocationDropdown
                    options={currentOptions}
                    processor={processor}
                    setProcessor={setProcessor}
                    disabled={disabled}
                />
                <div>
                    <label className="text-sm text-primaryText font-semibold">
                        {t("qrScanner:completionDate")}
                    </label>
                    <DateField
                        date={date}
                        setDate={setDate}
                        disabled={disabled}
                    />
                </div>
                <div>
                    <label className="text-sm text-primaryText font-semibold">
                        {t("qrScanner:passed")}
                    </label>
                    <ButtonYesOrNo
                        passed={passed}
                        setPassed={setPassed}
                        disabled={disabled}
                    />
                </div>
                <Cycle cycle={cycle} setCycle={setCycle} disabled={true} />
                <OrderNo
                    selectedOrderNo={selectedOrderNo}
                    setSelectedOrderNo={setSelectedOrderNo}
                    disabled={disabled}
                />
            </div>
        ) : (
            <ProcessSkeleton />
        );
    };

    return (
        <div className="flex flex-col w-full p-2 bg-white rounded-lg">
            <h2 className="font-semibold text-md leading-loose text-primaryText mt-2">
                {t("qrScanner:processStatus")}
            </h2>
            {renderLocations()}
        </div>
    );
};

export default Process;
