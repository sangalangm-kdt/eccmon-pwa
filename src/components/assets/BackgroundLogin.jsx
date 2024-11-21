import React from "react";
import { backgroundDrop } from "../styles/styles";
import backgroundImage from "./svg/background.svg";

const BackgroundLogin = () => {
  return (
    <div className={`${backgroundDrop.bgDrop}`}>
      <img src={backgroundImage} alt="Background" />
    </div>
  );
};

export default BackgroundLogin;
