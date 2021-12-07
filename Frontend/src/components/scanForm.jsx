import React from "react";
import Form from "./commons/form";
import Joi from "@hapi/joi";

class ScanForm extends Form {
  state = {};

  schema = Joi.object({
    classroomImage: Joi.any().label("Classrooms Image"),
    classroom: Joi.string().required().label("Classroom"),
  });

  constructor(props) {
    super(props);
    this.state = { data: props.data, errors: props.errors, classrooms: props.classrooms };
  }

  componentDidUpdate(prevProps) {
    const { errors } = this.props;

    if (errors.classroom !== prevProps.errors.classroom) {
      this.setState({ errors });
    }
  }

  doSubmit = async () => {
    this.props.onScan(this.state.data);
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="mb-5">
        {this.renderFile("Classroom Picture", "classroomImage")}
        {this.renderSelect("Classroom Name", "classroom", this.props.classrooms)}
        {this.renderSubmitButton("Scan")}
      </form>
    );
  }
}

export default ScanForm;
