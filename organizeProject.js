const fs = require("fs");
const path = require("path");

// Define the new folder structure
const folders = [
  "src/components/assets",
  "src/components/auth",
  "src/components/constants",
  "src/components/pages",
  "src/components/styles",
  "src/components/utils",
  "src/context",
  "src/data",
  "src/features/auth",
  "src/features/page",
  "src/features/process",
  "src/features/scannedResult",
  "src/features/status",
  "src/hooks",
  "src/lib",
  "src/locales",
  "src/state",
  "src/tests",
];

// Define file movements
const fileMoves = {
  "serviceWorkerRegistration.js": "src/",
  "setupTests.js": "src/tests/",
  "history.jsx": "src/",
  "i18n.js": "src/locales/",
  "reportWebVitals.js": "src/tests/",
};

// Function to create folders
function createFolders() {
  folders.forEach((folder) => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
      console.log(`✅ Created folder: ${folder}`);
    }
  });
}

// Function to move files
function moveFiles() {
  Object.entries(fileMoves).forEach(([file, targetFolder]) => {
    const oldPath = path.join(__dirname, "src", file);
    const newPath = path.join(__dirname, targetFolder, file);

    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      console.log(`📂 Moved ${file} → ${targetFolder}`);
    }
  });
}

// Execute organization
createFolders();
moveFiles();

console.log("🎉 Project structure organized successfully!");
