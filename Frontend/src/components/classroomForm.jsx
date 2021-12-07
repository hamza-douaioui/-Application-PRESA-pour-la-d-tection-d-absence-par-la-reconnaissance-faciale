import React from "react";
import Joi from "@hapi/joi";
import Form from "./commons/form";
import PageTitle from "./commons/pageTitle";
import { getClassroom, saveClassroom } from "./../services/classroomService";
import { Link } from "react-router-dom";

class ClassroomForm extends Form {
  state = {
    data: { name: "" },
    errors: {},
  };

  schema = Joi.object({
    _id: Joi.string(),
    name: Joi.string().required().label("Name"),
  });

  async componentDidMount() {
    try {
      const classroomsId = this.props.match.params.id;
      if (classroomsId === "new") return;

      const { data: classroom } = await getClassroom(classroomsId);
      if (!classroom) return this.props.history.replace("/not-found");

      const mappedClassroom = this.mapToViewModel(classroom);

      this.setState({ data: mappedClassroom });
    } catch ({ response }) {
      if (response && response.status === 404) this.props.history.replace("/not-found");
    }
  }

  mapToViewModel(classroom) {
    return { _id: classroom._id, name: classroom.name };
  }

  doSubmit = async () => {
    try {
      await saveClassroom(this.state.data);
      this.props.history.replace("/classrooms");
    } catch ({ response }) {
      if (response && response.status === 400) {
        const errors = { ...this.state.errors };
        errors.name = response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    const classroomsId = this.props.match.params.id;
    const title = classroomsId === "new" ? "Add Classroom" : "Edit Classroom";
    return (
      <React.Fragment>
        <PageTitle title={title} />
        <div className="container">
          <div className="mb-3 py-3 border-bottom">
            <Link className="btn btn-sm btn-secondary" to="/classrooms" title="Classroom List">
              <i className="fa fa-arrow-left" aria-hidden="true" ></i> Back To Classrooms
            </Link>
          </div>
          <form onSubmit={this.handleSubmit}>
            {this.renderInput("Name", "name")}
            {this.renderSubmitButton(classroomsId === "new" ? "Add" : "Edit")}
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default ClassroomForm;
