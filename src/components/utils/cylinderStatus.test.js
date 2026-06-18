import {
  buildCylinderHistoryEvents,
  buildDisposalUpdatePayload,
  buildOperationSavePayload,
  getDisplayStatus,
  getHistoryStatusBadgeText,
  getInventoryCategoryStatus,
  isCylinderInDisposalState,
  isDisposed,
  isDisposalOperation,
  isInventoryProcessStage,
  isScannedResultReadOnly,
  matchesInventoryCategory,
  normalizeScannedCylinder,
  resolveCurrentCylinderStatusLabel,
  resolveOperationCycle,
  toDisposalDatePayload,
} from "./cylinderStatus";

describe("getDisplayStatus", () => {
  test("resolves home summary status from latest update when cover status is stale", () => {
    const cylinder = {
      serialNumber: "HK-786",
      is_disposed: 1,
      status: "Dismounted",
      disposalDate: null,
      updates: { process: "Mounted" },
    };

    expect(getDisplayStatus(cylinder)).toBe("Dismounted");

    const events = buildCylinderHistoryEvents(cylinder, []);
    expect(events[0].historyDisplay.status).toBe("Dismounted");
    expect(events[0].historyDisplay.statusKey).toBe("dismounted");
    expect(matchesInventoryCategory(cylinder, "dismounted")).toBe(false);
    expect(matchesInventoryCategory(cylinder, "mounted")).toBe(true);
  });

  test("is_disposed === 2 always displays Disposal", () => {
    expect(
      getDisplayStatus({
        is_disposed: 2,
        status: "Dismounted",
      }),
    ).toBe("Disposal");

    expect(
      getDisplayStatus({
        is_disposed: 2,
        status: "Mounted",
      }),
    ).toBe("Disposal");
  });

  test("is_disposed === 1 preserves actual status", () => {
    expect(
      getDisplayStatus({
        is_disposed: 1,
        status: "Mounted",
      }),
    ).toBe("Mounted");

    expect(
      getDisplayStatus({
        is_disposed: 1,
        status: "Storage",
      }),
    ).toBe("Storage");
  });

  test("disposal_date does not affect display status", () => {
    expect(
      getDisplayStatus({
        is_disposed: 1,
        status: "Dismounted",
        disposalDate: "2025-04-01",
      }),
    ).toBe("Dismounted");

    expect(
      isDisposed({
        is_disposed: 1,
        disposalDate: "2025-04-01",
      }),
    ).toBe(false);
  });

  test("inventory counts disposed cylinders under disposal", () => {
    expect(
      getInventoryCategoryStatus({
        is_disposed: 2,
        status: "Mounted",
      }),
    ).toBe("disposal");

    expect(
      getInventoryCategoryStatus({
        is_disposed: 1,
        status: "Dismounted",
      }),
    ).toBe("dismounted");

    expect(
      matchesInventoryCategory(
        { is_disposed: 2, status: "Assembly" },
        "disposal",
      ),
    ).toBe(true);

    expect(
      matchesInventoryCategory(
        { is_disposed: 2, status: "Assembly" },
        ["disassembly", "grooving", "lmd", "assembly", "finishing"],
      ),
    ).toBe(false);
  });

  test("assembly and disassembly count under process", () => {
    expect(isInventoryProcessStage("Assembly")).toBe(true);
    expect(isInventoryProcessStage("Disassembly")).toBe(true);

    expect(
      matchesInventoryCategory(
        { is_disposed: 1, status: "Assembly" },
        ["disassembly", "grooving", "lmd", "assembly", "finishing"],
      ),
    ).toBe(true);

    expect(
      matchesInventoryCategory(
        { is_disposed: 1, status: "Storage", updates: { process: "Disassembly" } },
        ["disassembly", "grooving", "lmd", "assembly", "finishing"],
      ),
    ).toBe(true);
  });

  test("disposed cylinders count under disposal when only cover status is set", () => {
    expect(
      matchesInventoryCategory(
        { is_disposed: 1, status: "Disposal", updates: { process: "Mounted" } },
        "disposal",
      ),
    ).toBe(true);

    expect(
      getInventoryCategoryStatus({
        serialNumber: "T-2020",
        status: "Disposal",
        is_disposed: 1,
        updates: { process: "Mounted" },
      }),
    ).toBe("disposal");
  });

  test("HK-787 shows Disassembly in recent history when cover status is Disassembly", () => {
    const cylinder = {
      serialNumber: "HK-787",
      status: "Disassembly",
      is_disposed: 1,
      updates: { process: "Assembly" },
    };

    expect(getDisplayStatus(cylinder)).toBe("Disassembly");
    expect(resolveCurrentCylinderStatusLabel(cylinder)).toBe("Disassembly");

    const events = buildCylinderHistoryEvents(cylinder, []);
    expect(events[0].historyDisplay.status).toBe("Disassembly");
    expect(events[0].historyDisplay.statusKey).toBe("disassembly");
    expect(
      getHistoryStatusBadgeText(events[0], (key, opts) => opts?.defaultValue ?? key),
    ).toBe("Disassembly");
  });

  test("normalizeStatusToken prefers disassembly over assembly in compound strings", () => {
    expect(
      getInventoryCategoryStatus({
        is_disposed: 1,
        status: "Storage",
        updates: { process: "Disassembly → Assembly" },
      }),
    ).toBe("disassembly");
  });

  test("exact status tokens resolve correctly", () => {
    expect(resolveCurrentCylinderStatusLabel({ status: "Assembly" })).toBe(
      "Assembly",
    );
    expect(resolveCurrentCylinderStatusLabel({ status: "Disassembly" })).toBe(
      "Disassembly",
    );
    expect(resolveCurrentCylinderStatusLabel({ status: "Dismounted" })).toBe(
      "Dismounted",
    );
    expect(
      resolveCurrentCylinderStatusLabel({ is_disposed: 2, status: "Mounted" }),
    ).toBe("Disposal");
  });

  test("T-2020 shows Disposal badge in recent history when cover status is Disposal", () => {
    const cylinder = {
      serialNumber: "T-2020",
      status: "Disposal",
      is_disposed: 1,
      updates: { process: "Mounted" },
    };

    expect(isCylinderInDisposalState(cylinder)).toBe(true);
    expect(resolveCurrentCylinderStatusLabel(cylinder)).toBe("Disposal");

    const events = buildCylinderHistoryEvents(cylinder, []);
    expect(events[0].historyDisplay.status).toBe("Disposal");
    expect(events[0].historyDisplay.statusKey).toBe("disposal");
  });

  test("is_disposed === 2 always resolves to Disposal", () => {
    const cylinder = {
      serialNumber: "T-2021",
      status: "Mounted",
      is_disposed: 2,
      updates: { process: "Mounted" },
    };

    expect(resolveCurrentCylinderStatusLabel(cylinder)).toBe("Disposal");
    expect(getInventoryCategoryStatus(cylinder)).toBe("disposal");
  });

  test("latest storage update counts under storage even when cylinder status is stale", () => {
    const cylinder = {
      is_disposed: 1,
      status: "Dismounted",
      process: "Dismounted",
      updates: { process: "Storage", status: "Storage" },
    };

    expect(getInventoryCategoryStatus(cylinder)).toBe("storage");
    expect(matchesInventoryCategory(cylinder, "storage")).toBe(true);
    expect(matchesInventoryCategory(cylinder, "dismounted")).toBe(false);
  });
});

describe("scanned result read-only", () => {
  test("detects disposed cylinder when is_disposed is on API envelope", () => {
    const locationState = {
      data: {
        serialNumber: "T-3022",
        status: "Disposal",
        disposalDate: "2025-03-15",
      },
      is_disposed: 2,
    };

    expect(normalizeScannedCylinder(locationState)?.is_disposed).toBe(2);
    expect(isScannedResultReadOnly(locationState)).toBe(true);
  });

  test("new cylinder flow stays editable", () => {
    expect(
      isScannedResultReadOnly({
        isNewCylinder: true,
        data: { serialNumber: "NEW-1", is_disposed: 1 },
      }),
    ).toBe(false);
  });
});

describe("disposal save helpers", () => {
  test("isDisposalOperation matches Disposal status", () => {
    expect(isDisposalOperation("Disposal")).toBe(true);
    expect(isDisposalOperation("Storage")).toBe(false);
  });

  test("toDisposalDatePayload returns YYYY-MM-DD", () => {
    expect(toDisposalDatePayload("2025-06-16T14:30")).toBe("2025-06-16");
  });

  test("buildDisposalUpdatePayload matches legacy cylinder-update body", () => {
    expect(
      buildDisposalUpdatePayload(
        {
          serialNumber: "T-2",
          location: "None",
          dateDone: "2025-06-16T10:00",
          cycle: 3,
        },
        "Disposal",
      ),
    ).toEqual({
      serialNumber: "T-2",
      process: "Disposal",
      location: "None",
      cycle: 3,
      dateDone: "2025-06-16T10:00",
      otherDetails: null,
      other_details: null,
    });
  });

  test("buildOperationSavePayload sets disposal fields only for Disposal", () => {
    expect(
      buildOperationSavePayload(
        { serialNumber: "T-1", dateDone: "2025-06-16T10:00", location: "KHI" },
        "Storage",
      ),
    ).toMatchObject({
      status: "Storage",
      process: "Storage",
      location: "None",
      is_disposed: 1,
      isDisposed: 1,
      disposalDate: null,
      disposal_date: null,
    });

    expect(
      buildOperationSavePayload(
        { serialNumber: "T-2", dateDone: "2025-06-16T10:00" },
        "Disposal",
      ),
    ).toMatchObject({
      status: "Disposal",
      process: "Disposal",
      is_disposed: 2,
      isDisposed: 2,
      disposalDate: "2025-06-16",
      disposal_date: "2025-06-16",
    });
  });
});

describe("operation cycle handling", () => {
  test("new cylinder defaults to cycle 1", () => {
    expect(resolveOperationCycle({}, "Storage")).toBe(1);
    expect(buildOperationSavePayload({ serialNumber: "NEW-1" }, "Storage")).toMatchObject({
      cycle: 1,
    });
  });

  test("existing cylinder keeps the saved cycle", () => {
    expect(resolveOperationCycle({ cycle: 3 }, "Storage")).toBe(3);
    expect(
      buildOperationSavePayload({ serialNumber: "EX-3", cycle: 3 }, "Storage"),
    ).toMatchObject({
      cycle: 3,
    });
  });

  test("dismounted cylinder moving to storage increments cycle", () => {
    expect(
      resolveOperationCycle(
        { cycle: 3 },
        "Storage",
        { status: "Dismounted", cycle: 3 },
      ),
    ).toBe(4);
    expect(
      buildOperationSavePayload(
        { serialNumber: "DM-3", cycle: 3 },
        "Storage",
        { status: "Dismounted", cycle: 3 },
      ),
    ).toMatchObject({
      cycle: 4,
    });
  });
});
