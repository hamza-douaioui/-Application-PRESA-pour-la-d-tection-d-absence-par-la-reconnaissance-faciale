import React, { Component } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { getStudents, deleteStudent, getStudentAvatar } from "../services/studentService";
import { getClassrooms } from "./../services/classroomService";
import ListGroup from "./commons/listGroups";
import PageTitle from "./commons/pageTitle";
import DeleteButton from "./commons/deleteButton";

class Students extends Component {
  state = {
    students: [],
    classrooms: [],
    selectedClassroom: { _id: "", name: "All students" },
  };

  async populateClassrooms() {
    try {
      const { data: classrooms } = await getClassrooms();
      this.setState({ classrooms: [{ _id: "", name: "All students" }, ...classrooms] });
    } catch (ex) {
      toast.error("Error While Loading the Classrooms");
    }
  }

  async populateStudents() {
    try {
      const { data: students } = await getStudents();
      for (const student of students) {
        student.avatarImage = await getStudentAvatar(student);
      }
      this.setState({ students: students });
    } catch (ex) {
      toast.error("Error While Loading the Students");
    }
  }

  async componentDidMount() {
    await this.populateClassrooms();
    await this.populateStudents();
  }

  handleDeleteStudent = async (student) => {
    const originalStudent = this.state.students;
    try {
      const students = originalStudent.filter((c) => c._id !== student._id);
      this.setState({ students: students });
      await deleteStudent(student._id);
    } catch (ex) {
      this.setState({ students: originalStudent });
    }
  };

  handleSelectClassroom = (classroom) => {
    this.setState({ selectedClassroom: classroom });
  };

  filterStudents = () => {
    const { students, selectedClassroom } = this.state;
    const filtredStudents =
      selectedClassroom && selectedClassroom._id
        ? students.filter((student) => student.classrooms.includes(selectedClassroom._id))
        : students;
    return filtredStudents;
  };

  render() {
    const { classrooms, selectedClassroom } = this.state;

    const filtredStudents = this.filterStudents();

    return (
      <React.Fragment>
        <PageTitle title="Students" />
        <div className="container">
          <div className="mb-3 py-3 border-bottom"  title="Add A New Student">
            <Link className="btn btn-sm btn-primary" to="/students/new">
              <i className="fa fa-plus" aria-hidden="true" ></i> Add A Student
            </Link>
          </div>

          <div className="row row-cols-1 row-cols-md-4 mb-4">
            <div className="col mb-2">
              <div className="card shadow-sm text-center bg-light">
                <div className="card-body">
                  <p className="card-text font-weight-bold"  title="Number Of Students">{filtredStudents.length} Students</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-3">
              <ListGroup
                items={classrooms}
                selectedItem={selectedClassroom}
                onItemSelect={this.handleSelectClassroom}
              />
            </div>
            <div className="col-lg-9">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th></th>
                      <th scope="col">First Name</th>
                      <th scope="col">Last Name</th>
                      <th scope="col">CIN</th>
                      <th scope="col">CNE</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtredStudents.map((student) => (
                      <tr key={student._id}>
                        <td>
                          <img
                            style={{ width: "48px", height: "48px" }}
                            src={student.avatarImage}
                            alt={student.firstName}
                            className="rounded-circle"
                          />
                        </td>
                        <td>{student.firstName}</td>
                        <td>{student.lastName}</td>
                        <td>{student.cin}</td>
                        <td>{student.cne}</td>
                        <td className="text-right">
                          <Link
                             className="btn btn-sm btn-outline-primary rounded-circle mr-2"
                            title="Edit Student's Info"
                            to={"/students/" + student._id}
                          >
                            <i className="fa fa-pencil" aria-hidden="true"></i>
                          </Link>
                          <Link
                            className="btn btn-sm btn-info mr-2 rounded-circle"
                            title="Add Student's Profiles"
                            to={"/students/" + student._id + "/profiles"}
                          >
                            <i className="fa fa-table" aria-hidden="true"></i>
                          </Link>
                          <DeleteButton
                            rounded
                            size="sm"
                            onDelete={() => this.handleDeleteStudent(student)}
                          >
                            <i className="fa fa-trash-o" aria-hidden="true"></i>
                          </DeleteButton>
                        </td>
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

export default Students;
