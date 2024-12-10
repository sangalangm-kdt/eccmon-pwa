import React from "react";
import "./preloader.scss";
import LogoPreloader from "./logo.svg";

// The Preloader now relies on a prop to control visibility
const Preloader = ({ isLoading }) => {
  return (
    <div
      className={`h-screen w-full flex flex-row items-center justify-center m-0 p-0`}
    >
      <div className="container-logo">
        <div className="📦">
          <img src={LogoPreloader} className="logo-preloader" alt="logo" />
        </div>
        {[...Array(5)].map((_, index) => (
          <div className="📦" key={index}></div>
        ))}
      </div>
    </div>
  );
};

export default Preloader;
