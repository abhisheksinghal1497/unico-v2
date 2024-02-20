export const convertToDateString = (date) => {
  let newDate;
  if (date && typeof date === 'object') {
    newDate = date.toUTCString();
    if (newDate) {
      return newDate;
    } else {
      console.log('convertToDateString Invalid Date Error');
      return null;
    }
  }

  if (date && typeof date === 'string') {
    newDate = new Date(date)?.toUTCString();
    if (newDate) {
      return newDate;
    } else {
      console.log('convertToDateString Invalid Date Error');
      return null;
    }
  }

  return null;
};
