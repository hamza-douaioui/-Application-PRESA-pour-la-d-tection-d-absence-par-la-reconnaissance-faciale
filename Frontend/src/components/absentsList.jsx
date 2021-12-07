import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import PageTitle from "./commons/pageTitle";
import moment from "moment";
import React, { Component } from "react";
import { getAbsents } from "./../services/absentService";
import { getClassrooms } from "../services/classroomService";
import Select from "./commons/select";
import Input from "./commons/input";

class AbsentsList extends Component {
  state = {
    absents: [],
    classrooms: [],
    selectedClassroom: "",
    selectedCin: "",
    selectedCne: "",
    selectedName: "",
  };

  async componentDidMount() {
    try {
      const { data: absents } = await getAbsents();
      const { data: classrooms } = await getClassrooms();
      this.setState({
        absents,
        classrooms: [{ _id: "", name: "All Classrooms" }, ...classrooms],
      });
    } catch ({ response }) {
      if (response && response.status === 404) this.props.history.replace("/not-found");
      toast.error("Error While getting the list");
    }
  }

  handleInputChange = ({ currentTarget: input }) => {
    this.setState({ [input.name]: input.value });
  };

  filterAbsents = () => {
    const {
      selectedClassroom,
      selectedCin,
      selectedCne,
      selectedName,
      absents: originalAbsents,
    } = this.state;

    const absentsByClassroom =
      selectedClassroom === ""
        ? originalAbsents
        : originalAbsents.filter((absent) => absent.classroom._id === selectedClassroom);

    const absentsByCin =
      selectedCin === ""
        ? absentsByClassroom
        : absentsByClassroom.filter((absent) => absent.student.cin.includes(selectedCin));

    const absentsByCne =
      selectedCne === ""
        ? absentsByCin
        : absentsByCin.filter((absent) => absent.student.cne.includes(selectedCne));

    const absentsByName =
      selectedName === ""
        ? absentsByCne
        : absentsByCne.filter(
            (absent) =>
              absent.student.firstName.includes(selectedName) ||
              absent.student.lastName.includes(selectedName)
          );

    return absentsByName;
  };

  getFormatedDate = (timeStamp) => {
    return moment(parseInt(timeStamp)).format("dddd DD MMMM YYYY , h:mm:ss");
  };

  render() {
    const { classrooms, selectedClassroom, selectedCin, selectedCne, selectedName } = this.state;

    const filtredAbsents = this.filterAbsents();
    return (
      <React.Fragment>
        <PageTitle title="Absents List" />
        <div className="container">
          <div className="mb-3 py-3 border-bottom">
            <Link className="btn btn-sm btn-secondary" to="/">
              <i className="fa fa-arrow-left" aria-hidden="true"></i> Go Scan
            </Link>
          </div>
          <div className="my-3">
            <div className="row">
              <div className="col-lg-3">
                <Select
                  label="Classroom"
                  name="selectedClassroom"
                  options={classrooms}
                  value={selectedClassroom}
                  onChange={this.handleInputChange}
                />
              </div>
              <div className="col-lg-3">
                <Input
                  label="CIN"
                  name="selectedCin"
                  value={selectedCin}
                  onChange={this.handleInputChange}
                />
              </div>
              <div className="col-lg-3">
                <Input
                  label="CNE"
                  name="selectedCne"
                  value={selectedCne}
                  onChange={this.handleInputChange}
                />
              </div>
              <div className="col-lg-3">
                <Input
                  label="Name"
                  name="selectedName"
                  value={selectedName}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>CIN</th>
                  <th>CNE</th>
                  <th>Absent Classroom</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {filtredAbsents.map((absent) => (
                  <tr key={absent._id}>
                    <td>{absent.student.firstName}</td>
                    <td>{absent.student.lastName}</td>
                    <td>{absent.student.cin}</td>
                    <td>{absent.student.cne}</td>
                    <td>{absent.classroom.name}</td>
                    <td>{this.getFormatedDate(absent.time)}</td>
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

export default AbsentsList;
