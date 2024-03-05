import { parseISO } from 'date-fns';

export const convertToDateString = (date) => {
  let newDate;
  // console.log('type of date', typeof date, date);
  if (date && typeof date === 'object') {
    newDate = date?.toISOString();
    if (newDate) {
      return newDate;
    } else {
      console.log('convertToDateString Invalid Date Error');
      return null;
    }
  }

  if (date && typeof date === 'string') {
    newDate = parseISO(date);
    // console.log('Converted Date', newDate, );
    if (newDate) {
      return newDate;
    } else {
      console.log('convertToDateString Invalid Date Error');
      return null;
    }
  }

  return null;
};
