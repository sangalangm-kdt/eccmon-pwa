import React, { useState, useEffect } from "react";
import "./preloader.scss";
import LogoPreloader from "./logo.svg";

const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Minimum display time for preloader

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`h-screen w-full flex flex-row items-center justify-center m-0 p-0 ${
        isLoading ? "active" : "hidden"
      }`}
    >
      <div className="container-logo">
        <div className="📦">
          <img src={LogoPreloader} className="logo-preloader" alt="logo" />
        </div>
        {/* Add more boxes for animation */}
        {[...Array(5)].map((_, index) => (
          <div className="📦" key={index}></div>
        ))}
      </div>
    </div>
  );
};

export default Preloader;
