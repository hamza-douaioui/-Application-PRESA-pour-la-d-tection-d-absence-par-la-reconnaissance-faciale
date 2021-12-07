import React, { Component } from "react";
import PageTitle from "./commons/pageTitle";

class NotFound extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <PageTitle title="Not Found" />
      </React.Fragment>
    );
  }
}

export default NotFound;
