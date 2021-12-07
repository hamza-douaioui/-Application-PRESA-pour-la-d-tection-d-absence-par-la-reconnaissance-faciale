import { objectToFormData } from "object-to-formdata";

export function jsonToFormData(obj) {
  const options = {
    indices: false,
  };

  return objectToFormData(obj, options);
}
