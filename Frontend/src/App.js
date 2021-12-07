import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import NavBar from "./components/navBar";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/loginForm";
import NotFound from "./components/notFound";
import Students from "./components/students";
import StudentForm from "./components/studentForm";
import Classrooms from "./components/classrooms";
import ClassroomForm from "./components/classroomForm";
import Logout from "./components/logout";
import StudentProfiles from "./components/studentProfiles";
import ScanPage from "./components/scanPage";
import { getCurrentUser } from "./services/authService";
import ProtectedRoute from "./components/commons/ProtectedRoute";
import AbsentsList from "./components/absentsList";
import MyAccount from "./components/myAccount";
import { getUserAvatar } from "./services/userService";
import "./App.css";

class App extends Component {
  state = {};

  async componentDidMount() {
    const user = getCurrentUser();
    if (user) {
      try {
        user.avatarImage = await getUserAvatar();
      } catch (ex) {
        user.avatarImage = undefined;
      }
      this.setState({ user });
    }
  }

  render() {
    const user = this.state.user;
    return (
      <React.Fragment>
        <ToastContainer />
        <NavBar user={user} />
        <div className="container-fluid p-0 pb-5">
          <Switch>
            <ProtectedRoute path="/absents" component={AbsentsList} />
            <ProtectedRoute path="/students/:id/profiles" component={StudentProfiles} />
            <ProtectedRoute path="/students/:id" component={StudentForm} />
            <ProtectedRoute path="/students" component={Students} />
            <ProtectedRoute path="/classrooms/:id" component={ClassroomForm} />
            <ProtectedRoute path="/classrooms" component={Classrooms} />
            <ProtectedRoute path="/me" exact component={MyAccount} />
            <ProtectedRoute path="/" exact component={ScanPage} />
            <ProtectedRoute path="/logout" component={Logout} />
            {!user && <Route path="/login" component={LoginForm} />}
            {!user && <Route path="/register" component={RegisterForm} />}
            <Route path="/not-found" component={NotFound} />
            <Redirect to="/not-found" />
          </Switch>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
