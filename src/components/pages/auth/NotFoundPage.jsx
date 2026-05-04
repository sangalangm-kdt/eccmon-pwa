/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";
import LinkBroken from "../../assets/svg/link-broken.svg";
// import { useAuthentication } from "../../hooks/auth";

const NotFoundPage = () => {
  // const { user } = useAuthentication();

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <img src={LinkBroken} className="xs:w-36 lg:w-48" alt="notFound" />
        <label className="items-center justify-center text-lg font-light text-primary opacity-50">
          Page link not found
        </label>
      </div>
      <div className="mt-2">
        <Link to="/" className="text-sm text-secondaryText underline">
          Click here to go back
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
