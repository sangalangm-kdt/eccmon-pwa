import {
  buildAdditionalDetailRows,
  buildDisplayDetails,
  formatDetailLabel,
  getDisplayableDetailEntries,
  mapDetailEntryToRow,
} from "./displayValueUtils";

const t = (key) => {
  const labels = {
    "viewInfo.addDetails.case": "Case",
    "viewInfo.addDetails.isPassed": "Status",
    "viewInfo.addDetails.orderNo": "Order No.",
    "viewInfo.addDetails.engineNo": "Engine No.",
    "viewInfo.addDetails.operatingHours": "Operating Hours",
    "viewInfo.addDetails.totalHours": "Total Operating Hours",
    "viewInfo.addDetails.mountingPosition": "Mounting Position",
    "viewInfo.addDetails.caseValues.newBuild": "New Build",
    "viewInfo.addDetails.caseValues.regeneration": "Regeneration",
    "viewInfo.addDetails.caseValues.maintenance": "Maintenance",
    "viewInfo.addDetails.statusValues.ongoing": "Ongoing",
    "viewInfo.addDetails.statusValues.passed": "Passed",
    "viewInfo.addDetails.statusValues.failed": "Failed",
    "viewInfo.lastModifiedBy": "Last modified by",
    updated: "Updated",
    "viewInfo.process": "Process",
    "viewInfo.completionDate": "Completion Date",
    "viewInfo.location": "Location",
    "viewInfo.cycle": "Cycle",
    "viewInfo.disposalDate": "Disposal Date",
    "viewInfo.disposalHistory.disposalStatus": "Disposal Status",
    "viewInfo.disposalHistory.disposalDate": "Disposal Date",
    "viewInfo.disposalHistory.disposedBy": "Disposed By",
    "viewInfo.disposalHistory.remarks": "Disposal Remarks",
    "qrScanner:disposal": "Disposal",
  };
  return labels[key] ?? key;
};

describe("formatDetailLabel", () => {
  test("formats snake_case and camelCase keys", () => {
    expect(formatDetailLabel("engine_no", t)).toBe("Engine No.");
    expect(formatDetailLabel("mounting_position", t)).toBe("Mounting Position");
    expect(formatDetailLabel("customField", t)).toBe("Custom Field");
  });
});

describe("getDisplayableDetailEntries", () => {
  test("filters empty and internal keys", () => {
    const entries = getDisplayableDetailEntries({
      engineNumber: "E-100",
      processor: "internal",
      location: "Plant A",
      remarks: "",
    });

    expect(entries).toEqual([["engineNumber", "E-100"]]);
  });
});

describe("buildAdditionalDetailRows", () => {
  test("maps mounted process fields and total hours", () => {
    const rows = buildAdditionalDetailRows(
      {
        engineNumber: "E-200",
        operationHours: 12,
        mountingPosition: "Front",
      },
      { t, displayStatus: "Mounted", totalOperationHours: 48 },
    );

    expect(rows.map((row) => row.key)).toEqual([
      "engineNumber",
      "operationHours",
      "totalHours",
      "mountingPosition",
    ]);
    expect(rows[0].value).toBe("E-200");
    expect(rows[2].value).toBe("48");
  });

  test("maps process case and status values", () => {
    const rows = buildAdditionalDetailRows(
      { case: 1, isPassed: 1, orderNumber: "ORD-1" },
      { t, displayStatus: "Assembly" },
    );

    expect(rows[0]).toMatchObject({ key: "case", value: "Regeneration" });
    expect(rows[1]).toMatchObject({
      key: "isPassed",
      value: "Passed",
      kind: "badge",
      badgeTone: "pass",
    });
    expect(rows[2]).toMatchObject({ key: "orderNumber", value: "ORD-1" });
  });
});

describe("buildDisplayDetails", () => {
  test("builds common and additional rows for active cylinders", () => {
    const result = buildDisplayDetails(
      {
        serialNumber: "T-392",
        updates: {
          location: "Kobe",
          cycle: 2,
          otherDetails: { engineNumber: "E-1" },
        },
      },
      {
        t,
        historyRecord: {
          location: "Kobe",
          cycle: 2,
          otherDetails: { engineNumber: "E-1" },
        },
        modifiedBy: "Test User",
        displayUpdatedAt: "2026-03-17 10:30",
        displayStatus: "Mounted",
        completionDate: "2026-03-17T10:30:00.000Z",
        totalOperationHours: 10,
      },
    );

    expect(result.serialNumber).toBe("T-392");
    expect(result.commonRows.map((row) => row.key)).toEqual([
      "lastModifiedBy",
      "updated",
      "process",
      "completionDate",
      "location",
      "cycle",
    ]);
    expect(result.additionalRows).toHaveLength(1);
    expect(result.additionalRows[0].key).toBe("engineNumber");
  });

  test("hides empty common fields", () => {
    const result = buildDisplayDetails(
      { serialNumber: "T-100", updates: {} },
      {
        t,
        historyRecord: { cycle: 1 },
        displayStatus: "Storage",
        modifiedBy: "",
        displayUpdatedAt: null,
        completionDate: null,
      },
    );

    expect(result.commonRows.map((row) => row.key)).toEqual(["process", "cycle"]);
  });
});

describe("mapDetailEntryToRow", () => {
  test("formats ISO dates without showing raw strings", () => {
    const row = mapDetailEntryToRow(
      "disposalDate",
      "2026-03-17T08:15:00.000Z",
      { t },
    );

    expect(row.value).not.toContain("T");
    expect(row.value).toBeTruthy();
  });
});
