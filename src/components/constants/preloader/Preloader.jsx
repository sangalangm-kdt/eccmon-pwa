import React from "react";
import "./preloader.scss";
import LogoPreloader from "./logo.svg";

const Preloader = () => {
  return (
    <div className="h-screen w-full flex flex-row items-center justify-center m-0 p-0">
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
