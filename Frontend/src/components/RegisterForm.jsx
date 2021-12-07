import React from "react";
import Joi from "@hapi/joi";
import Form from "./commons/form";
import { register } from "../services/userService";
import { loginWithJwt } from "../services/authService";
import PageTitle from "./commons/pageTitle";
import Reaptcha from 'reaptcha';
import AppConfig from "../App.config"


class RegisterForm extends Form {
  state = {
    data: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      avatar: {},
    },
    verified: false,
    errors: {},
  };

  schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .label("Email"),
    password: Joi.string().required().label("Password"),
    passwordConfirmation: Joi.ref("/password"),
    avatar: Joi.any().required(),
  });

  doSubmit = async () => {
    if(this.state.verified){
    try {
      const response = await register(this.state.data);

      loginWithJwt(response.headers["x-auth-token"]);
      window.location = "/";
    } catch ({ response }) {
      if (response && response.status === 400) {
        const errors = { ...this.state.errors };
        errors.avatar = response.data;
        this.setState({ errors });
      }
    }
  }else{
    alert('Please Verify You Are A Human!');
  }
  };



  onVerify = recaptchaResponse => {
    this.setState({
      verified: true
    });
  };

  render() {
    return (
      <React.Fragment>
        <PageTitle title="Create New Account" />
        <div className="container">
          <form onSubmit={this.handleSubmit}>
            {this.renderInput("First Name", "firstName")}
            {this.renderInput("Last Name", "lastName")}
            {this.renderInput("Email", "email", "email")}
            {this.renderInput("Password", "password", "password")}
            {this.renderInput("Password Confirmation", "passwordConfirmation", "password")}
            {this.renderFile("Profile Picture", "avatar")}
            <Reaptcha sitekey={AppConfig.GOOGLE.reCaptcha} onVerify={this.onVerify} />
            {this.renderSubmitButton("Sign Up")}
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default RegisterForm;
