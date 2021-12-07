import React, { Component } from "react";

class Input extends Component {
  state = {};
  render() {
    const { label, name, error, ...rest } = this.props;
    return (
      <div className="form-group">
        <label htmlFor={name}>{label}</label>
        <input className="form-control" id={name} name={name} {...rest} />
        {error && <small className="form-text text-danger">{error}</small>}
      </div>
    );
  }
}

export default Input;
