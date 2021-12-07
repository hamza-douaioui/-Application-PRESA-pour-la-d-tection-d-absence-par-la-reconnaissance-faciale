import React, { Component } from "react";
import Input from "./input";
import Select from "./select";
import FileInput from "./fileInput";
import CheckBox from "./checkBox";

class Form extends Component {
  state = { data: {}, errors: {} };

  validateInput = ({ name, value }) => {
    const config = { abortEarly: false };

    const data = { ...this.state.data };
    data[name] = value;

    let { error } = this.schema.validate(data, config);

    if (!error) return null;

    const errors = {};

    error.details.forEach((detail) => {
      errors[detail.path[0]] = detail.message;
    });

    error = errors[name];
    return error ? error : null;
  };

  validateForm = () => {
    const config = { abortEarly: false };

    const { error } = this.schema.validate(this.state.data, config);

    if (!error) return null;

    const errors = {};

    error.details.forEach((detail) => {
      errors[detail.path[0]] = detail.message;
    });

    return errors;
  };

  handleInputChange = ({ currentTarget: input }) => {
    const data = { ...this.state.data };
    data[input.name] = input.value;

    const errors = { ...this.state.errors };
    const errorMessage = this.validateInput(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    this.setState({ data, errors });
  };

  handleCheckBoxChange = ({ currentTarget: input }) => {
    const data = { ...this.state.data };

    if (Array.isArray(data[input.name])) {
      if (input.checked) {
        data[input.name].push(input.value);
      } else {
        data[input.name] = data[input.name].filter((v) => input.value !== v);
      }
    } else {
      if (input.checked) {
        data[input.name] = input.value;
      } else {
        data[input.name] = "";
      }
    }
    this.setState({ data });
  };

  handleFileChange = ({ currentTarget: input }) => {
    const data = { ...this.state.data };

    data[input.name] = input.files[0] || {};

    const errors = { ...this.state.errors };
    const errorMessage = this.validateInput(input);

    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    this.setState({ data, errors });
  };

  handleMultipleFileChange = ({ currentTarget: input }) => {
    const data = { ...this.state.data };

    const files = [];
    for (let i = 0; i < input.files.length; i++) {
      files.push(input.files[i]);
    }

    data[input.name] = files;

    const errors = { ...this.state.errors };
    const errorMessage = this.validateInput(input);

    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    this.setState({ data, errors });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const errors = this.validateForm();
    this.setState({ errors: errors || {} });

    if (errors) return;

    this.doSubmit();
  };

  renderSubmitButton(label) {
    return (
      <button disabled={this.validateForm()} className="btn btn-primary">
        {label}
      </button>
    );
  }

  renderInput(label, name, type = "text") {
    const { data, errors } = this.state;
    return (
      <Input
        label={label}
        name={name}
        type={type}
        value={data[name]}
        error={errors[name]}
        onChange={this.handleInputChange}
      />
    );
  }

  renderCheckBox(label, name, value, checked) {
    const { errors } = this.state;
    return (
      <CheckBox
        key={value}
        label={label}
        name={name}
        value={value}
        error={errors[name]}
        checked={checked}
        onChange={this.handleCheckBoxChange}
      />
    );
  }

  renderFile(label, name) {
    const { data, errors } = this.state;
    return (
      <FileInput
        label={label}
        name={name}
        value={data[name].name || ""}
        error={errors[name]}
        onChange={this.handleFileChange}
      />
    );
  }

  renderMultipleFileInput(label, name) {
    const { data, errors } = this.state;

    return (
      <FileInput
        label={label}
        name={name}
        value={(data[name].length && data[name].length + " file") || data[name]}
        error={errors[name]}
        onChange={this.handleMultipleFileChange}
        multiple={true}
      />
    );
  }

  renderSelect(label, name, options, valueProperty = undefined, textProperty = undefined) {
    const { data, errors } = this.state;

    return (
      <Select
        label={label}
        name={name}
        value={data[name]}
        options={options}
        error={errors[name]}
        textProperty={textProperty}
        valueProperty={valueProperty}
        onChange={this.handleInputChange}
      />
    );
  }
}

export default Form;
