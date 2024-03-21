import { differenceInBusinessDays, differenceInCalendarDays } from "date-fns";
export function getDateDifference(leadCreatedDate, todaysDate) {
  // const getCreatedYear = leadCreatedDate.slice(6, 10);
  // const getCreatedMonth = leadCreatedDate.slice(3, 5);
  // const getCreatedDay = leadCreatedDate.slice(0, 2);

  // const getTodaysYear = todaysDate.slice(6, 10);
  // const getTodaysMonth = todaysDate.slice(3, 5);
  // const getTodaysDay = todaysDate.slice(0, 2);

  // let getCreatedMonthValue = "";
  // if (getCreatedMonth.slice(0, 1) == 0) {
  //   getCreatedMonthValue = getCreatedMonth.slice(1, 2);
  // } else {
  //   getCreatedMonthValue = getCreatedMonth.slice(0, 2);
  // }
  // let getCreatedDayValue = "";
  // if (getCreatedDay.slice(0, 1) == 0) {
  //   getCreatedDayValue = getCreatedDay.slice(1, 2);
  // } else {
  //   getCreatedDayValue = getCreatedDay.slice(0, 2);
  // }

  // let getTodaysMonthValue = "";
  // if (getTodaysMonth.slice(0, 1) == 0) {
  //   getTodaysMonthValue = getTodaysMonth.slice(1, 2);
  // } else {
  //   getTodaysMonthValue = getTodaysMonth.slice(0, 2);
  // }
  // let getTodaysDayValue = "";
  // if (getTodaysDay.slice(0, 1) == 0) {
  //   getTodaysDayValue = getTodaysDay.slice(1, 2);
  // } else {
  //   getTodaysDayValue = getTodaysDay.slice(0, 2);
  // }

  // const dateDifference = differenceInCalendarDays(
  //   new Date(getTodaysYear, getTodaysMonthValue, getTodaysDayValue),
  //   new Date(getCreatedYear, getCreatedMonthValue, getCreatedDayValue)
  // );
  let date1 = new Date(leadCreatedDate);
  let date2 = new Date();

  // Calculating the time difference
  // of two dates
  let Difference_In_Time = date2.getTime() - date1.getTime();

  // Calculating the no. of days between
  // two dates
  let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));

  // To display the final no. of days (result)
  console.log(
    "Total number of days between dates:\n" +
      date1.toDateString() +
      " and " +
      date2.toDateString() +
      " is: " +
      Difference_In_Days +
      " days"
  );

  return Difference_In_Days;
}
