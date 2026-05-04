// src/tutorial.js

import introJs from "intro.js";

export const QrScannerTutorial = () => {
  const intro = introJs();

  intro.setOptions({
    steps: [
      {
        element: ".scanner-container",
        intro: "This is where the QR scanner will display the camera feed.",
        position: "bottom",
      },
      {
        element: ".scanner-area",
        intro: "Align the QR code within this area to scan it.",
        position: "top",
      },
      {
        element: ".flash-button",
        intro: "Tap here to toggle the flashlight on or off.",
        position: "left",
      },
      {
        element: ".camera-switch-button",
        intro: "Tap here to switch between front and back cameras.",
        position: "left",
      },
      {
        element: ".manual-add-button",
        intro:
          "If you can't scan the QR code, you can manually add the cylinder cover.",
        position: "top",
      },
    ],
  });

  intro.start();
};
