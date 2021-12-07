import React from "react";
import Form from "./commons/form";
import Joi from "@hapi/joi";

class ProfileForm extends Form {
  state = {};

  schema = Joi.object({
    profiles: Joi.any().label("Profiles"),
  });

  constructor(props) {
    super(props);
    this.state = { data: props.data, errors: props.errors };
  }

  componentDidUpdate(prevProps) {
    const { errors } = this.props;

    if (errors.profiles !== prevProps.errors.profiles) {
      this.setState({ errors });
    }
  }

  doSubmit = async () => {
    this.props.onAddProfiles(this.state.data);
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="mb-5">
        {this.renderMultipleFileInput("Profiles", "profiles")}
        {this.renderSubmitButton("Add")}
      </form>
    );
  }
}

export default ProfileForm;
