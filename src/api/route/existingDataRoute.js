const express = require("express");
const router = express.Router();

// Mock database (replace with real database logic)
const dataStore = [
  {
    eccId: "T-1234",
    cylinderStatus: "Mounting",
    cycleCount: 1,
    isDisposed: 0,
    disposalDate: "",
    locationSite: "KLL",
    startDate: "2024-11-19T05:30",
    completionDate: "2024-11-24T05:30",
    isPassed: 1,
    orderNo: "317YYYYB100",
    siteName: "イビデン大垣中央",
  },
];

// POST endpoint to check if the scanned code exists
router.post("/check-code", (req, res) => {
  const { eccId } = req.body;

  // Validate eccId format
  if (!eccId || typeof eccId !== "string") {
    return res.status(400).json({ message: "Invalid ECC ID format" });
  }

  const entry = dataStore.find((item) => item.eccId === eccId);

  if (entry) {
    console.log(entry);
    return res.status(200).json(entry);
  } else {
    const newEntry = {
      eccId,
      cylinderStatus: "",
      cycleCount: 0,
      isDisposed: 0,
      disposalDate: "",
      locationSite: "Unknown",
      startDate: "",
      completionDate: "",
      isPassed: 0,
      orderNo: "",
    };

    // Add the new entry to the mock database
    dataStore.push(newEntry);
    return res.status(201).json(newEntry); // Return the newly created entry
  }
});

module.exports = router;
