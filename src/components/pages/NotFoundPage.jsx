import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div>
      Error Not Found
      <Link to="/login" className="flex flex-col gap-2">
        Back to Login
      </Link>
    </div>
  );
};

export default NotFoundPage;
