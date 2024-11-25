import React from "react";
import { Link } from "react-router-dom";
import LinkBroken from "../assets/svg/link-broken.svg";

const NotFoundPage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center ">
      <div className=" flex flex-col items-center justify-center">
        <img src={LinkBroken} className="xs:w-36 lg:w-48" alt="notFound" />
        <label className="text-2xl items-center justify-center font-medium text-primary opacity-40 ">
          Page link not found
        </label>
      </div>
      <div className="mt-10">
        <Link to="/" className="underline text-secondaryText">
          Click here to go back
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
