import React, { Component } from "react";
import { toast } from "react-toastify";
import { getStudent, getStudentProfile, addProfilesToStudent } from "../services/studentService";
import ProfileForm from "./profileForm";
import PageTitle from "./commons/pageTitle";
import { Link } from "react-router-dom";

class StudentProfiles extends Component {
  state = {
    student: {},
    data: { profiles: [] },
    errors: {},
  };

  async componentDidMount() {
    try {
      const studentId = this.props.match.params.id;

      const { data: student } = await getStudent(studentId);
      if (!student) return this.props.history.replace("/not-found");

      this.setState({ student });
    } catch ({ response }) {
      if (response && response.status === 404) this.props.history.replace("/not-found");
      toast.error("Error While Loading Student");
    }
  }

  handleAddProfiles = async (data) => {
    try {
      const { data: profiles } = await addProfilesToStudent(this.state.student, data.profiles);

      const student = { ...this.state.student };
      student.profiles = [...profiles];

      this.setState({ student });
    } catch ({ response }) {
      if (response && response.status === 400) {
        const errors = { ...this.state.errors };
        errors.profiles = response.data;
        this.setState({ errors });
      }
    }
  };

  handleLoadImage = async (ev, profile) => {
    ev.currentTarget.src = await getStudentProfile(this.state.student, profile);
  };

  render() {
    const { student, data, errors } = this.state;

    return (
      <React.Fragment>
        <PageTitle title="Profiles" />
        <div className="container">
          <div className="mb-3 py-3 border-bottom">
            <Link className="btn btn-sm btn-secondary" to="/students">
              <i className="fa fa-arrow-left" aria-hidden="true"></i> Students
            </Link>
          </div>

          <ProfileForm data={data} errors={errors} onAddProfiles={this.handleAddProfiles} />
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4">
            {student.profiles &&
              student.profiles.map((profile) => (
                <div key={profile} className="col mb-4">
                  <div className="card text-center h-100">
                    <img
                      src=""
                      className="card-img-top"
                      alt="profile"
                      onError={(ev) => this.handleLoadImage(ev, profile)}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default StudentProfiles;
