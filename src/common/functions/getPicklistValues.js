export const GetPicklistValues = (arr, fieldName) => {
  if (!arr || !fieldName) {
    return {};
  }
  return arr?.find((value) => value.name === fieldName)?.picklistValues;
};
