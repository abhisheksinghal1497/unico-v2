import { meetingdataActions } from '../slices/MeetingDataSlice';
import { startOfWeek, endOfWeek } from 'date-fns';
import { convertToDateString } from '../../../common/functions/ConvertToDateString';
import { QueryObject } from '../../../services/QueryObject';
import { query } from '../../../common/constants/Queries';

export const getMeetingData = () => {
  const date = new Date();
  let startWeekDate = startOfWeek(date);
  let endWeekDate = endOfWeek(date);

  const startDate = convertToDateString(startWeekDate);
  const endDate = convertToDateString(endWeekDate);
  console.log('Meeting Data called in action');
  console.log(startDate, endDate);

  return async (dispatch) => {
    try {
      dispatch(
        meetingdataActions.getMeetingData({
          meetingdata: [],
          hasError: false,
          loading: true,
        })
      );

      const meetingListdata = await QueryObject(
        query.getMeetingData(startDate, endDate)
      );
      console.log(
        'Meeting Data called in action Try',
        meetingListdata.records,
        query.getMeetingData(startDate, endDate)
      );
      console.log('meeting list records', meetingListdata);
      dispatch(
        meetingdataActions.getMeetingData({
          meetingdata: meetingListdata.records,
          hasError: false,
          loading: false,
        })
      );
    } catch (error) {
      console.log('Meeting Data called in action Catch', error);

      dispatch(
        meetingdataActions.getMeetingData({
          meetingdata: [],
          hasError: false,
          loading: false,
        })
      );
    }
  };
};
