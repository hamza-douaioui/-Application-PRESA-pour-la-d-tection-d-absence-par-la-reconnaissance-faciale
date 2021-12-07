import React, { Component } from "react";

class DeleteButton extends Component {
  deleteInterval = null;

  deleteBtnStyle = {
    position: "relative",
    zIndex: "3",
    overflow: "hidden",
  };

  deleteBtnBgStyle = {
    position: "absolute",
    top: "0px",
    left: "0px",
    height: "100%",
    width: "100%",
    zIndex: "2",
    transition: "ease",
    transitionDuration: "1s",
    padding: "0px",
    clipPath: "inset(0% 100% 0% 0%)",
  };

  state = {
    styleAnimatedBackground: { ...this.deleteBtnBgStyle },
  };

  showWhiteBg = () => {
    const { time } = this.props;
    const styleAnimatedBackground = { ...this.deleteBtnBgStyle };
    styleAnimatedBackground.transitionDuration = time + "s";
    styleAnimatedBackground.clipPath = "inset(0% 0% 0% 0%)";
    this.setState({ styleAnimatedBackground });
  };

  hideWhiteBg = () => {
    const styleAnimatedBackground = { ...this.deleteBtnBgStyle };
    styleAnimatedBackground.transitionDuration = ".2s";
    styleAnimatedBackground.clipPath = "inset(0% 100% 0% 0%)";
    this.setState({ styleAnimatedBackground });
  };

  handleDelete = () => {
    this.handleCancelDelete();
    this.props.onDelete();
  };

  handleStartDelete = (event) => {
    if (event.button !== 0) return;

    this.showWhiteBg();

    if (!this.deleteInterval) {
      this.deleteInterval = setInterval(this.handleDelete, this.props.time * 1000);
    }
  };

  handleCancelDelete = () => {
    this.hideWhiteBg();
    clearInterval(this.deleteInterval);
    this.deleteInterval = null;
  };

  render() {
    const { size, rounded } = this.props;
    const { styleAnimatedBackground } = this.state;

    let classNameBtn = "btn text-danger border border-danger ";
    let classNameBg = "btn btn-danger ";

    classNameBtn += size === "sm" ? "btn-sm " : "";
    classNameBtn += rounded ? "rounded-circle" : "";
    classNameBg += size === "sm" ? "btn-sm" : "";

    return (
      <span
        className={classNameBtn}
        style={this.deleteBtnStyle}
        title="Delete"
        onMouseDown={this.handleStartDelete}
        onMouseUp={this.handleCancelDelete}
        onMouseLeave={this.handleCancelDelete}
      >
        <button className={classNameBg} style={styleAnimatedBackground}>
          {this.props.children}
        </button>
        <span>{this.props.children}</span>
      </span>
    );
  }
}

DeleteButton.defaultProps = {
  time: 1,
};

export default DeleteButton;
