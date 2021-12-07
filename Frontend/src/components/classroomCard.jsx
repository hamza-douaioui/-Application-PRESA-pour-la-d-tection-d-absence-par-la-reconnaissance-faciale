import { Link } from "react-router-dom";
import React, { Component } from "react";
import DeleteButton from "./commons/deleteButton";

class ClassroomCard extends Component {
  state = {};

  render() {
    const { classroom, onDelete } = this.props;
    return (
      <div className="card text-center h-100">
        <div className="card-body">
          <h5 className="card-title">{classroom.name}</h5>
        </div>
        <div className="card-footer">
          <Link
            className="btn btn-sm btn-primary rounded-circle mr-2"
            to={"/classrooms/" + classroom._id}
          >
            <i className="fa fa-pencil" aria-hidden="true"></i>
          </Link>

          <DeleteButton rounded size="sm" onDelete={() => onDelete(classroom)}>
            <i className="fa fa-trash-o" aria-hidden="true"></i>
          </DeleteButton>
        </div>
      </div>
    );
  }
}

export default ClassroomCard;
