import React, {
  useEffect,
  useCallback,
  useRef,
  useContext,
  useState,
} from "react";
import {
  FlatList,
  View,
  Keyboard,
  Alert,
  StyleSheet,
  Text,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator, Searchbar, Button } from "react-native-paper";
import Icon from "react-native-vector-icons/AntDesign";
import { useInternet } from "../../store/context/Internet";
import { ErrorMessage } from "../../common/constants/ErrorConstants";
import customTheme from "../../common/colors/theme";
import { moderateScale, verticalScale } from "../../utils/matrcis";
import { LeadListStyles } from "../LeadList/styles/LeadListStyles";
import ErrorScreen from "../LeadList/component/ErrorScreen";
import { colors } from "../../common/colors";
import { format, parseISO } from "date-fns";
import { convertToDateString } from "../../common/functions/ConvertToDateString";
import { getMeetingData } from "../../store/redux/actions/meetingData";
import { NoInternet } from "../../common/components/NoInternetComponent/NoInternetScreen";
export default function MeetingList({ navigation }) {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = React.useState(false);
  const [meetingsData, setMeetingsData] = React.useState([]);
  const [todaysData, setTodaysData] = useState([]);
  const isOnline = useInternet();

  const [isWeekActive, setIsWeekActive] = useState(true);
  const [isTodayActive, setIsTodayActive] = useState(false);

  const [loading, setLoading] = useState(false);

  const {
    hasError,
    meetingdata,
    loading: meetLoading,
  } = useSelector((state) => state.meetingdata);

  const filterTodaysDataList = async () => {
    const date = new Date();

    let todaysDate = convertToDateString(date);

    const onlyDate = todaysDate.slice(0, 10);
    let filterdedData = meetingdata?.filter((item) => {
      let dateFromApi = item?.StartDateTime?.slice(0, 10);
      return dateFromApi == onlyDate;
    });
    // console.log("filterdedData", filterdedData);
    setTodaysData(filterdedData);
  };

  const getDataList = async (meetData) => {
    setLoading(meetLoading);

    setMeetingsData(meetData);

    filterTodaysDataList();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      dispatch(getMeetingData());
    });
    return unsubscribe;
  }, [isOnline, navigation]);

  useEffect(() => {
    // console.log("Is Online or not", isOnline);
    getDataList(meetingdata);
  }, [meetingdata]);

  const onRefresh = async () => {
    setRefreshing(true);
    getDataList(meetingdata);
    setRefreshing(false);
  };

  const thisWeekButton = () => {
    setIsWeekActive(true);
    setIsTodayActive(false);
  };
  const todaysButton = () => {
    setIsTodayActive(true);
    setIsWeekActive(false);
  };

  const tryAgainButton = () => {
    console.log("Try Again Button clicked");
  };

  const renderItem = ({ item }) => {
    // console.log(
    //   'Dates',
    //   parseISO(item?.StartDateTime),
    //   item?.StartDateTime,
    //   item?.EndDateTime
    // );
    let formatedDate =
      item?.StartDateTime &&
      format(parseISO(item?.StartDateTime), "dd/MM/yyyy");
    let formatedStartTime =
      item?.StartDateTime && format(parseISO(item?.StartDateTime), "hh:mm a");
    let formatedEndTime =
      item?.EndDateTime && format(parseISO(item?.EndDateTime), "hh:mm a");

    return (
      <View style={styles.itemStyle}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flexDirection: "row", flex: 1 }}>
            <View>
              <Icon
                name="calendar"
                size={40}
                color={colors.gray300}
                style={{ marginRight: 5 }}
              />
            </View>
            <View>
              <Text style={styles.date}>{item.Who.Name.toUpperCase()}</Text>
              <Text>{item.Subject}</Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.date, { textAlign: "right" }]}>
              {formatedDate}
            </Text>
            <Text style={{ textAlign: "right" }}>
              {formatedStartTime} to {formatedEndTime}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading && !refreshing && (
        <View style={LeadListStyles.loaderView}>
          <ActivityIndicator size="large" color={customTheme.colors.primary} />
        </View>
      )}
      {isOnline ? (
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              margin: 10,
            }}
          >
            <View>
              <Button
                onPress={thisWeekButton}
                mode={isWeekActive ? "contained" : "outlined"}
                style={{
                  borderColor: customTheme.colors.primary,
                }}
              >
                This Week
              </Button>
            </View>
            <View>
              <Button
                onPress={todaysButton}
                mode={isTodayActive ? "contained" : "outlined"}
                style={{
                  borderColor: customTheme.colors.primary,
                }}
              >
                Today's Meetings
              </Button>
            </View>
          </View>

          <FlatList
            // contentContainerStyle={{ flexGrow: 1 }}
            ListEmptyComponent={
              !loading && <ErrorScreen message={ErrorMessage?.noRecords} />
            }
            data={isWeekActive ? meetingsData : todaysData}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.Id}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        </View>
      ) : (
        <View>
          <NoInternet onButtonPressed={tryAgainButton} />
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: verticalScale(50),
  },
  date: {
    color: colors.black,
    fontWeight: "bold",
    fontSize: 16,
  },
  itemStyle: {
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: colors.bgLight,
    margin: 10,
    padding: moderateScale(10),
    borderRadius: moderateScale(10),
    shadowColor: "#000",
    shadowOffset: {
      width: 20,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
