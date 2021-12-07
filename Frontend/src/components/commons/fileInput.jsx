import React, { Component } from "react";

class FileInput extends Component {
  state = {};
  render() {
    const { label, name, error, value, ...rest } = this.props;

    return (
      <div className="form-group">
        <label htmlFor={name}>{label}</label>
        <div className="custom-file">
          <input className="custom-file-input" id={name} name={name} {...rest} type="file" />
          <label className="custom-file-label" htmlFor={name}>
            {value || "Please Select A Valid Picture"}
          </label>
        </div>
        {error && <small className="form-text text-danger">{error}</small>}
      </div>
    );
  }
}

export default FileInput;
