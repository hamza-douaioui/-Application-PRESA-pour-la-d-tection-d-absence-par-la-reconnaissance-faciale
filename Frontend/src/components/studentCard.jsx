import { Link } from "react-router-dom";
import React from "react";

const StudentCard = ({ student, classrooms, onLoadImage, onDelete }) => {
  return (
    <div className="col mb-4">
      <div className="card text-center h-100">
        <img src={student.avatarImage} className="card-img-top" alt={student.firstName} />
        <div className="card-body">
          <h5 className="card-title">{student.firstName + " " + student.lastName}</h5>
          <div className="row text-left">
            <div className="col-lg-6">
              <p className="font-weight-bold">Cne</p>
            </div>
            <div className="col-lg-6">
              <p>{student.cne}</p>
            </div>
          </div>
          <div className="row text-left">
            <div className="col-lg-6">
              <p className="font-weight-bold">Cin</p>
            </div>
            <div className="col-lg-6">
              <p>{student.cin}</p>
            </div>
          </div>
        </div>
        <div className="card-footer">
          <Link className="btn btn-sm btn-primary mr-2" to={"/students/" + student._id}>
            <i className="fa fa-pencil" aria-hidden="true"></i>
          </Link>
          <Link
            className="btn btn-sm btn-primary mr-2"
            to={"/students/" + student._id + "/profiles"}
          >
            <i className="fa fa-table" aria-hidden="true"></i>
          </Link>
          <button
            title="Delete"
            className="btn btn-sm btn-danger"
            onClick={() => {
              onDelete(student);
            }}
          >
            <i className="fa fa-trash-o" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
