import React, { useEffect, useMemo, useState } from "react";

import EngineInfo from "./mountAndDismountInfo/EngineInfo";

import AdditionalInfo from "./mountAndDismountInfo/AdditionalInfo";

import { useLocation } from "react-router-dom";

import { formatDate } from "../../../../utils/formatdate";

import { useAuthentication } from "../../../../../hooks/auth";

import { useTranslation } from "react-i18next";

import {
  getContinueDisabledMessage,
  getMissingRequiredFieldKeys,
  validateSelectionField,
} from "../../../../utils/formFieldValidation";

import {
  setFormDataIfChanged,
  setStateIfChanged,
} from "../../../../utils/syncFormState";

const MOUNT_DATA_KEYS = [
  "serialNumber",
  "location",
  "dateDone",
  "cycle",
  "otherDetails",
];

const Dismounting = ({
  selectedStatus,
  setData,
  disabled,
  showAlert,
  setIsComplete,
  setContinueDisabledReason,
}) => {
  const location = useLocation();
  const cylinderData = location.state?.data;
  const serialNumber = cylinderData?.serialNumber ?? "";
  const cylinderStatus = cylinderData?.status;
  const { user } = useAuthentication();
  const { t } = useTranslation("qrScanner");

  const [initialData] = useState(cylinderData);
  const [site, setSite] = useState(initialData?.location);
  const [siteOptionsAvailable, setSiteOptionsAvailable] = useState(true);
  const [engineNum, setEngineNum] = useState(
    initialData?.updates?.otherDetails?.engineNumber,
  );
  const [opHours, setOpHours] = useState(
    initialData?.updates?.otherDetails?.operationHours,
  );
  const [mountPos, setMountPos] = useState(
    initialData?.updates?.otherDetails?.mountingPosition,
  );
  const [date, setDate] = useState(() => {
    const today = initialData?.updates?.dateDone
      ? new Date(initialData?.updates?.dateDone)
      : new Date();
    return formatDate(today);
  });
  const [cycle, setCycle] = useState(initialData?.cycle);

  const siteRequired = user.is_admin === 1;
  const resolvedSite = useMemo(
    () =>
      user.is_admin === 1
        ? site || user.affiliation || "None"
        : user.affiliation,
    [site, user.affiliation, user.is_admin],
  );

  useEffect(() => {
    if (selectedStatus === cylinderStatus) {
      setSite(cylinderData?.location);
      setEngineNum(cylinderData?.updates?.otherDetails?.engineNumber || "");
      setOpHours(cylinderData?.updates?.otherDetails?.operationHours || "");
      setMountPos(cylinderData?.updates?.otherDetails?.mountingPosition || "");
      setDate(cylinderData?.updates?.dateDone || formatDate(new Date()));
    } else {
      setSite("");
      setEngineNum("");
      setOpHours("");
      setMountPos("");
      setDate(formatDate(new Date()));
    }
  }, [selectedStatus, cylinderStatus]);

  useEffect(() => {
    setData({
      serialNumber: cylinderData?.serialNumber,
      location: user.is_admin === 1 ? site : user.affiliation,
      dateDone: date,
      cycle: cycle,
      otherDetails: `{"engineNumber" : "${engineNum}", "operationHours" : "${opHours}", "mountingPosition" : "${mountPos}"}`,
    });
  }, [
    site,
    engineNum,
    opHours,
    mountPos,
    date,
    cycle,
    resolvedSite,
    siteRequired,
    siteOptionsAvailable,
    serialNumber,
    setData,
    setIsComplete,
    setContinueDisabledReason,
    t,
  ]);

  return (
    <div className="flex flex-col">
      <div className="w-full rounded-lg bg-white p-2 text-sm dark:bg-gray-500">
        <EngineInfo
          affiliation={user.affiliation}
          site={site}
          setSite={setSite}
          engineNum={engineNum}
          setEngineNum={setEngineNum}
          opHours={opHours}
          setOpHours={setOpHours}
          disabled={disabled}
          showAlert={showAlert}
          siteRequired={siteRequired}
          siteOptionsAvailable={siteOptionsAvailable}
          onSiteOptionsAvailabilityChange={setSiteOptionsAvailable}
        />
      </div>

      <div className="mt-3 w-full rounded-lg bg-white p-2 text-sm dark:bg-gray-500">
        <AdditionalInfo
          mountPos={mountPos}
          setMountPos={setMountPos}
          date={date}
          setDate={setDate}
          cycle={cycle}
          setCycle={setCycle}
          disabled={disabled}
          showAlert={showAlert}
        />
      </div>
    </div>
  );
};

export default Dismounting;
