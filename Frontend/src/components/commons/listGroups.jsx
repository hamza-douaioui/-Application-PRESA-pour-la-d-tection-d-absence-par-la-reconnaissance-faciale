import React, { Component } from "react";

class ListGroup extends Component {
  state = {};
  render() {
    const { items, selectedItem, valueProperty, textProperty, onItemSelect } = this.props;
    let classNameValue = "pointer list-group-item ";
    return (
      <ul className="list-group ">
        {items.map((item) => (
          <li
            key={item[valueProperty]}
            className={
              item[valueProperty] === selectedItem[valueProperty]
                ? classNameValue + "list-group-item-secondary"
                : classNameValue
            }
            onClick={() => onItemSelect(item)}
          >
            {item[textProperty]}
          </li>
        ))}
      </ul>
    );
  }
}

ListGroup.defaultProps = {
  valueProperty: "_id",
  textProperty: "name",
};

export default ListGroup;
