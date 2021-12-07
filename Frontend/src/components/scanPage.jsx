import React, { Component } from "react";
import ScanForm from "./scanForm";
import PageTitle from "./commons/pageTitle";
import { toast } from "react-toastify";
import { scan } from "../services/scanService";
import { getClassrooms } from "../services/classroomService";
import { getStudentAvatar } from "../services/studentService";

class ScanPage extends Component {
  state = {
    data: { classroomImage: {}, classroom: "" },
    errors: {},
    classrooms: [],
    students: [],
    scanImageResult: null,
  };

  async componentDidMount() {
    try {
      const { data: classrooms } = await getClassrooms();

      this.setState({ classrooms: [{ _id: "", name: "Select Classroom" }].concat(classrooms) });
    } catch ({ response }) {
      if (response && response.status === 404) this.props.history.replace("/not-found");
      toast.error("Error While Loading Classrooms ...");
    }
  }

  handleScan = async (data) => {
    try {
      const { data: result } = await scan(data);
      this.setState({
        students: result.students,
        scanImageResult: "data:image/png;base64," + result.resultImage,
      });
    } catch ({ response }) {
      if ((response && response.status === 400) || response.status === 404) {
        const errors = { ...this.state.errors };
        errors.classroom = response.data;
        this.setState({ errors });
      }
    }
  };

  handleLoadImage = async (ev, student) => {
    ev.currentTarget.src = await getStudentAvatar(student);
  };

  render() {
    const { classrooms, data, errors, scanImageResult, students } = this.state;

    return (
      <React.Fragment>
        <PageTitle title="Let's Scan" />
        <div className="container">
          <div className="mb-3 py-3 border-bottom">
            <button className="btn btn-sm btn-outline-secondary" disabled>
            Upload Classroom Picture
            </button>
            <span className="btn btn-sm text-secondary">
              <i className="fa fa-arrow-right" aria-hidden="true"></i>
            </span>
            <button className="btn btn-sm btn-outline-secondary" disabled>
              Select Target Classroom
            </button>
            <span className="btn btn-sm text-secondary">
              <i className="fa fa-arrow-right" aria-hidden="true"></i>
            </span>
            <button className="btn btn-sm btn-outline-secondary" disabled>
              Get Results
            </button>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <ScanForm
                data={data}
                errors={errors}
                classrooms={classrooms}
                onScan={this.handleScan}
              />
            </div>
            <div className="col-lg-6">
              {scanImageResult && (
                <img
                  style={{ maxHeight: "360px", overflow: "hidden" }}
                  className="img-fluid img-thumbnail"
                  src={scanImageResult}
                  alt=""
                />
              )}
              {!scanImageResult && (
                <div
                  className="border img-thumbnail d-flex align-items-center justify-content-center"
                  style={{ height: "360px" }}
                >
                  Scan To See Results
                </div>
              )}
            </div>
            <div className="col-lg-6">
              <h5 className="mb-3">Absence List</h5>
              <div className="table-responsive">
                <table className="table table-hover">
                  <tbody>
                    {students.length === 0 && (
                      <tr>
                        <td>There are no students absent today</td>
                      </tr>
                    )}
                    {students.map((student) => (
                      <tr key={student._id}>
                        <td>
                          <img
                            style={{ height: "60px" }}
                            src=""
                            alt={student.firstName}
                            className="img-thumbnail"
                            onError={(ev) => this.handleLoadImage(ev, student)}
                          />
                        </td>
                        <td>{student.firstName}</td>
                        <td>{student.lastName}</td>
                        <td>{student.cin}</td>
                        <td>{student.cne}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ScanPage;
