export const getDefaultValueOfField = (data) => {
  if (data.type === 'Text') {
    return '';
  } else if (data.type === 'Number') {
    return null;
  } else if (data.type === 'Textarea') {
    return '';
  } else if (data.type === 'Picklist') {
    // if (data.options?.length > 0) {
    //   return typeof data.options[0];
    // } else {
    return '';
    // }
  } else {
    return '';
  }
};
