import React from "react";

const PageTitle = ({ title }) => {
  return (
    <React.Fragment>
      <div
        className="py-5 bg-secondary text-light border-top mb-5 d-flex justify-content-center align-items-center"
        style={{ minHeight: "360px" }}
      >
        <h1 className="font-weight-normal">{title}</h1>
      </div>
    </React.Fragment>
  );
};

export default PageTitle;
