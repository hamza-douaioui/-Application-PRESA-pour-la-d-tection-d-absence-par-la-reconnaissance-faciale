import React, { Component } from "react";

class CheckBox extends Component {
  state = {};
  render() {
    const { label, name, error, ...rest } = this.props;
    return (
      <div className="form-group">
        <div className="form-check">
          <input className="form-check-input" type="checkbox" name={name} {...rest} />
          <label className="form-check-label">{label}</label>
        </div>
        {error && <small className="form-text text-danger">{error}</small>}
      </div>
    );
  }
}

export default CheckBox;
