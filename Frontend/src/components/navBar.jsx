import React, { Component } from "react";
import { Link } from "react-router-dom";

class NavBar extends Component {
  state = {};

  render() {
    const { user } = this.props;
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <Link className="navbar-brand mr-5" to="/" title ="Welcom To Presa">
          Presa
        </Link>
       

        <div className="collapse navbar-collapse" id="navBarToggledContent">
          <div className="navbar-nav mr-auto">
            {user && (
              <React.Fragment>
                <Link className="nav-item nav-link mr-lg-3" to="/" title="Let's Scan">
                  <i className="fa fa-home" aria-hidden="true"></i> Home
                </Link>
                <Link className="nav-item nav-link mr-lg-3" to="/classrooms" title="All Classromms">
                  <i className="fa fa-th-large" aria-hidden="true"></i> Classrooms
                </Link>
                <Link className="nav-item nav-link mr-lg-3" to="/students" title="All Students">
                  <i className="fa fa-users" aria-hidden="true"></i> Students
                </Link>
                <Link className="nav-item nav-link mr-lg-3" to="/absents" title="Absences List">
                  <i className="fa fa-calendar-times-o" aria-hidden="true"></i> Absences History
                </Link>
              </React.Fragment>
            )}
          </div>

          <div className="navbar-nav">
            {!user && (
              <React.Fragment>
                <Link className="btn btn-sm btn-primary mr-lg-2 my-2 my-lg-0" to="/login">
                Log In
                </Link>
                <Link className="btn btn-sm btn-success  my-2 my-lg-0" to="/register">
                Create New Account
                </Link>
              </React.Fragment>
            )}
            {user && (
              <li className="nav-item dropdown pointer">
                <span
                  className="nav-link dropdown-toggle"
                  id="navbarDropdownMenuLink"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <img
                    className="rounded-circle"
                    style={{ width: "40px", height: "40px" }}
                    src={user.avatarImage ? user.avatarImage : "https://picsum.photos/200/200"}
                    alt="avatarimage"
                  />
                </span>
                <div
                  className="dropdown-menu dropdown-menu-right"
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  <Link className="dropdown-item mb-2" to="/me">
                    <i className="fa fa-user-circle-o" aria-hidden="true"></i> See Your Profile
                  </Link>
                  <Link className="dropdown-item text-danger" to="/Logout">
                    <i className="fa fa-power-off" aria-hidden="true"></i> Log Out
                  </Link>
                </div>
              </li>
            )}
          </div>
        </div>
      </nav>
    );
  }
}

export default NavBar;
