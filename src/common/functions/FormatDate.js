export function formatDateToDDMMYYYY(inputDate) {
  // // Ensure the inputDate is a valid date string
  // const date = new Date(inputDate);

  // if (isNaN(date.getTime())) {
  //   return 'Invalid Date';
  // }

  // // Get day, month, and year components from the date
  // const day = String(date.getDate()).padStart(2, '0');
  // const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  // const year = date.getFullYear();

  // // Assemble the formatted date string
  // return `${day}-${month}-${year}`;
  if (typeof inputDate !== 'string') {
    return 'Invalid Date';
  }
  const dateComponents = inputDate.split(/[-T:.Z]/);
  if (dateComponents.length < 6) {
    return 'Invalid Date';
  }
  const year = dateComponents[0];
  const month = dateComponents[1];
  const day = dateComponents[2];
  return `${day}/${month}/${year}`;
}
