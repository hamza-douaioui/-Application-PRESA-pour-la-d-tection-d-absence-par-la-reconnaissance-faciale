import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getClassrooms, deleteClassroom } from "../services/classroomService";
import PageTitle from "./commons/pageTitle";
import DeleteButton from "./commons/deleteButton";

class Classrooms extends Component {
  state = {
    classrooms: [],
  };

  async componentDidMount() {
    try {
      const { data: classrooms } = await getClassrooms();
      this.setState({ classrooms });
    } catch (ex) {
      toast.error("Error While Loading the Classrooms");
    }
  }

  handleDeleteClassroom = async (classroom) => {
    const originalClassrooms = this.state.classrooms;
    try {
      const classrooms = originalClassrooms.filter((c) => c._id !== classroom._id);
      this.setState({ classrooms });
      await deleteClassroom(classroom._id);
    } catch (ex) {
      this.setState({ classrooms: originalClassrooms });
      toast.error("Error While Deleting the Classroom");
    }
  };

  render() {
    const { classrooms } = this.state;

    return (
      <React.Fragment>
        <PageTitle title="Classrooms" />
        <div className="container">
          <div className="mb-3 py-3 border-bottom">
            <Link className="btn btn-sm btn-primary" title="Add A New Classroom" to="/classrooms/new">
              <i className="fa fa-plus" aria-hidden="true"></i> Add Classroom
            </Link>
          </div>
          <div className="row row-cols-1 row-cols-md-4 mb-4">
            <div className="col mb-2">
              <div className="card shadow-sm text-center bg-light">
                <div className="card-body">
                  <p className="card-text font-weight-bold" title="Number Of Classrooms">{classrooms.length} classrooms</p>
                </div>
              </div>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {classrooms.map((classroom) => (
                  <tr key={classroom._id}>
                    <td>{classroom.name}</td>
                    <td className="text-right">
                      <Link
                        className="btn btn-sm btn-outline-primary rounded-circle mr-2" title="Edit Classroom Name"
                        to={"/classrooms/" + classroom._id}
                      >
                        <i className="fa fa-pencil" aria-hidden="true"></i>
                      </Link>

                      <DeleteButton
                        rounded
                        size="sm"
                        onDelete={() => this.handleDeleteClassroom(classroom)}
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
      </React.Fragment>
    );
  }
}

export default Classrooms;
