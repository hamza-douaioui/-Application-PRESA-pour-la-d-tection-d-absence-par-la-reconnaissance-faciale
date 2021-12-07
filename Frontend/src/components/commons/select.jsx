import React, { Component } from "react";

class Select extends Component {
  state = {};
  render() {
    const { label, name, error, options, valueProperty, textProperty, ...rest } = this.props;

    return (
      <div className="form-group">
        <label htmlFor={name}>{label}</label>
        <select className="custom-select" id={name} name={name} {...rest}>
          {options.map((option) => (
            <option key={option[valueProperty]} value={option[valueProperty]}>
              {option[textProperty]}
            </option>
          ))}
        </select>
        {error && <small className="form-text text-danger">{error}</small>}
      </div>
    );
  }
}

Select.defaultProps = {
  valueProperty: "_id",
  textProperty: "name",
};
export default Select;
