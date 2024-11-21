const express = require("express");
const router = express.Router();

// Storage process options
const processStorageOptions = [
  { id: 1, locationName: "KLL" },
  { id: 2, locationName: "大前運送" },
  { id: 3, locationName: "パーツセンター" },
];

// Disassembly process options
const processDisassemblyOptions = [
  { id: 1, locationName: "東洋鉄工" },
  { id: 2, locationName: "東亜工機" },
  { id: 3, locationName: "三共エンジ" },
  { id: 4, locationName: "福助GE" },
];

// Grooving process options
const processGroovingOptions = [
  { id: 1, locationName: "茶屋テクノロジー" },
  { id: 2, locationName: "茶屋テクSK - 1" },
];

// LMD process option
const processLMDOption = [{ id: 1, locationName: "KHI" }];

// Finishing process options
const processFinishingOption = [
  { id: 1, locationName: "茶屋テクノロジー" },
  { id: 2, locationName: "茶屋テクSK - 1" },
];

// Assembly process options
const processAssemblyOption = [
  { id: 1, locationName: "東亜工機" },
  { id: 2, locationName: "和幸産業" },
  { id: 3, locationName: "三共エンジ" },
  { id: 4, locationName: "福助GE" },
];

// Endpoint for each process
router.get("/process-storage", (req, res) => {
  res.json(processStorageOptions);
});

router.get("/process-disassembly", (req, res) => {
  res.json(processDisassemblyOptions);
});

router.get("/process-grooving", (req, res) => {
  res.json(processGroovingOptions);
});

router.get("/process-lmd", (req, res) => {
  res.json(processLMDOption);
});

router.get("/process-finishing", (req, res) => {
  res.json(processFinishingOption);
});

router.get("/process-assembly", (req, res) => {
  res.json(processAssemblyOption);
});

module.exports = router;
