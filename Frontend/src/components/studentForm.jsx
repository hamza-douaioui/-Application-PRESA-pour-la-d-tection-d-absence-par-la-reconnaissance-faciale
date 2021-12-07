import React from "react";
import Joi from "@hapi/joi";
import Form from "./commons/form";
import { getClassrooms } from "./../services/classroomService";
import { saveStudent, getStudent } from "../services/studentService";
import PageTitle from "./commons/pageTitle";
import { Link } from "react-router-dom";

class StudentForm extends Form {
  state = {
    data: {
      firstName: "",
      lastName: "",
      cin: "",
      cne: "",
      classrooms: [],
      avatar: "",
    },
    classrooms: [],
    errors: {},
  };

  schema = Joi.object({
    _id: Joi.string(),
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    cin: Joi.string().required().label("Cin"),
    cne: Joi.string().required().label("Cne"),
    classrooms: Joi.array(),
    passwordConfirmation: Joi.ref("/password"),
    avatar: Joi.any().required().label("Avatar"),
  });

  async componentDidMount() {
    try {
      const { data: classrooms } = await getClassrooms();
      this.setState({ classrooms });

      const studentId = this.props.match.params.id;
      if (studentId === "new") return;

      const { data: student } = await getStudent(studentId);
      if (!student) return this.props.history.replace("/not-found");

      const mappedStudent = this.mapToViewModel(student);

      this.setState({ data: mappedStudent });
    } catch ({ response }) {
      if (response && response.status === 404) this.props.history.replace("/not-found");
    }
  }

  mapToViewModel(student) {
    return {
      _id: student._id,
      firstName: student.firstName,
      lastName: student.lastName,
      cin: student.cin,
      cne: student.cne,
      avatar: student.avatar,
      classrooms: student.classrooms,
    };
  }

  doSubmit = async () => {
    try {
      await saveStudent(this.state.data);
      this.props.history.replace("/students");
    } catch ({ response }) {
      if (response && response.status === 400) {
        const errors = { ...this.state.errors };
        errors.avatar = response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    const { classrooms, data } = this.state;
    const studentId = this.props.match.params.id;
    const title = studentId === "new" ? "Add Student" : data.firstName + " " + data.lastName;
    return (
      <React.Fragment>
        <PageTitle title={title} />
        <div className="container">
          <div className="mb-3 py-3 border-bottom">
            <Link className="btn btn-sm btn-secondary" to="/students" title="Students List">
              <i className="fa fa-arrow-left" aria-hidden="true"></i> Back To Students
            </Link>
          </div>
          <form onSubmit={this.handleSubmit}>
            {this.renderInput("First Name", "firstName")}
            {this.renderInput("Last Name", "lastName")}
            {this.renderInput("Cin", "cin")}
            {this.renderInput("Cne", "cne")}
            {classrooms.map((classroom) =>
              this.renderCheckBox(
                classroom.name,
                "classrooms",
                classroom._id,
                data.classrooms.includes(classroom._id)
              )
            )}
            {this.renderFile("Avatar", "avatar")}
            {this.renderSubmitButton("Submit")}
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default StudentForm;
