import React, { Component } from "react";
import { getCurrentUser } from "../services/authService";
import { Link } from "react-router-dom";
import PageTitle from "./commons/pageTitle";
import { getStudents } from "../services/studentService";
import { toast } from "react-toastify";
import { getUserAvatar } from "../services/userService";
import { getClassrooms } from "../services/classroomService";

class MyAccount extends Component {
  state = {
    user: getCurrentUser(),
    students: [],
    classrooms: [],
  };

  async populateClassrooms() {
    try {
      const { data: classrooms } = await getClassrooms();
      this.setState({ classrooms });
    } catch (ex) {
      toast.error("Error While Loading the Classrooms");
    }
  }

  async populateStudents() {
    try {
      const { data: students } = await getStudents();
      this.setState({ students });
    } catch (ex) {
      toast.error("Error While Loading the Students");
    }
  }

  async populateUserAvatar() {
    const user = { ...this.state.user };
    try {
      user.avatarImage = await getUserAvatar();
    } catch (error) {
      user.avatarImage = undefined;
    }
    this.setState({ user });
  }

  async componentDidMount() {
    const user = getCurrentUser();
    this.setState({ user });
    await this.populateUserAvatar();
    await this.populateClassrooms();
    await this.populateStudents();
  }

  render() {
    const { user, students, classrooms } = this.state;

    return (
      <React.Fragment>
        <PageTitle title={user.firstName + " " + user.lastName} />
        <div className="container">
          <div className="mb-3 py-3 border-bottom">
            <Link className="btn btn-sm btn-secondary" to="/" title="Let's Scan">
              <i className="fa fa-arrow-left" aria-hidden="true"></i> Go Scan
            </Link>
          </div>
          <div className="row row-cols-1 row-cols-md-4 mb-4">
            <div className="col mb-2">
              <div className="card shadow-sm text-center bg-light">
                <div className="card-body" title="Number Of Your Classrooms">
                  <p className="card-text font-weight-bold">{classrooms.length} Classrooms</p>
                </div>
              </div>
            </div>
            <div className="col mb-2">
              <div className="card shadow-sm text-center bg-light">
                <div className="card-body" title="Number Of your Students">
                  <p className="card-text font-weight-bold">{students.length} Students</p>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3">
              <div
                className="rounded-circle overflow-hidden bg-danger d-flex justify-content-center align-items-center "
                style={{ width: "180px", height: "180px" }}
              >
                <img
                  src={user.avatarImage ? user.avatarImage : "https://picsum.photos/200/200"}
                  style={{ height: "100%", width: "auto" }}
                  alt={user.firstName}
                />
              </div>
            </div>
            <div className="col-lg-9">
              <div className="row">
                <div className="col-lg-12 mb-4">
                  <div className="form-group">
                    <label className="text-muted">First Name</label>
                    <span className="font-weight-bold border-bottom d-block py-2">
                      {user.firstName}
                    </span>
                  </div>
                </div>
                <div className="col-lg-12 mb-4">
                  <div className="form-group">
                    <label className="text-muted">Last Name</label>
                    <span className="font-weight-bold border-bottom d-block py-2">
                      {user.lastName}
                    </span>
                  </div>
                </div>
                <div className="col-lg-12 mb-4">
                  <div className="form-group">
                    <label className="text-muted">Email</label>
                    <span className="font-weight-bold border-bottom d-block py-2">
                      {user.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default MyAccount;
