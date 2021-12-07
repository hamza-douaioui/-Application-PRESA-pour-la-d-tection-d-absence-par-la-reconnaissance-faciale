import React from "react";
import Joi from "@hapi/joi";
import Form from "./commons/form";
import { login } from "./../services/authService";
import PageTitle from "./commons/pageTitle";

class LoginForm extends Form {
  state = {
    data: { email: "", password: "" },
    errors: {},
  };

  schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .label("Email"),
    password: Joi.string().required().label("Password"),
  });

  doSubmit = async () => {
    try {
      await login(this.state.data);
      window.location = "/";
    } catch ({ response }) {
      if (response && response.status >= 400 && response.status >= 400) {
        const errors = { ...this.state.errors };
        errors.password = response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    return (
      <React.Fragment>
        <PageTitle title="Log In" />
        <div className="container">
          <form onSubmit={this.handleSubmit}>
            {this.renderInput("Email", "email", "email")}
            {this.renderInput("Password", "password", "password")}
            {this.renderSubmitButton("Log In")}
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default LoginForm;
