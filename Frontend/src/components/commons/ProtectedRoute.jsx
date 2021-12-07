import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { getCurrentUser } from "./../../services/authService";

class ProtectedRoute extends Component {
  render() {
    const { component: Component, render, ...rest } = this.props;

    return (
      <Route
        {...rest}
        render={(props) => {
          if (!getCurrentUser()) return <Redirect to="/login" />;
          return Component ? <Component {...props} /> : render(props);
        }}
      />
    );
  }
}

export default ProtectedRoute;
