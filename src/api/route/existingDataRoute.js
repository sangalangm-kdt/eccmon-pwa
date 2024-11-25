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

router.post("/check-code", (req, res) => {
  const { eccId } = req.body;

  if (!eccId || typeof eccId !== "string") {
    return res.status(400).json({ message: "Invalid ECC ID format" });
  }

  const entry = dataStore.find((item) => item.eccId === eccId);

  if (entry) {
    // If entry exists, return the entry with exists flag
    return res.status(200).json({ exists: true, entry });
  } else {
    // If entry does not exist, create a new entry
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

    dataStore.push(newEntry);
    return res.status(201).json({ exists: false, entry: newEntry }); // Return the newly created entry
  }
});

module.exports = router;
