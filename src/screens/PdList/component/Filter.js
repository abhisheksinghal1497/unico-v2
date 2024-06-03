import React, { useState } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Dialog, List, Portal, Button } from "react-native-paper";
import Icon from "react-native-vector-icons/AntDesign";
import { colors } from "../../../common/colors";
import { PdListStyles } from "../styles/PdListStyles";
import Touchable from "../../../common/components/TouchableComponent/Touchable";
import { updateRecordOffline } from "../../../store/soups/LeadSoup";
import { soupConfig } from "../../../common/constants/soupConstants";
import { promises } from "../../../utils/smartStorePromiser";
import { GetQuestionsJson } from "../../../services/GetRequestService/GetQuestionJson";
import { FormatFormJson } from "../../../common/functions/FormatFormJson";
import { useInternet } from "../../../store/context/Internet";
import Toast from "react-native-toast-message";
import { SegmentedButtons, Chip, RadioButton } from "react-native-paper";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../../../utils/matrcis";

const Filter = ({
  openMenu,
  closeMenu,
  visible,
  pdTypeFilter,
  setPdTypeFilter,
  setPdStatusFilter,
  pdStatusFilter,
}) => {
  const isOnline = useInternet();
  // const isCacheBtnDisabled = selectedCacheItems.length === 0 || !isOnline;
  console.log("pdTypeFilter----------------->", pdTypeFilter);
  // --------------------Local Filter--------------------
  const [localFilters, setLocalFilters] = useState({
    localPdStatus: pdStatusFilter,
    localPdType: pdTypeFilter,
  });

  // --------------Handle Filter Change
  const handleFilterChange = (filterName, value) => {
    setLocalFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };
  // --------------Apply Filter Handler---------------
  const handleApplyFilters = () => {
    setPdStatusFilter(localFilters.localPdStatus);
    setPdTypeFilter(localFilters.localPdType);
    closeMenu();
  };
  // --------------Close Handler---------------
  const handleCloseFilters = () => {
    handleFilterChange("localPdStatus", pdStatusFilter);
    handleFilterChange("localPdType", pdTypeFilter);
    closeMenu();
  };
  // -----------------------------------------------------------
  // console.log('isCacheBtnDisabled', isCacheBtnDisabled);
  // console.log('pdTypeFilter', pdTypeFilter);
  const PdTypeValues = [
    { label: "All", value: "All" },
    { label: "Tele PD", value: "Tele PD" },
    { label: "Physical PD", value: "Physical PD" },
  ];

  const PdStatusValues = [
    { label: "All", value: "All" },
    { label: "Initiated", value: "Initiated" },
    { label: "In Progress", value: "In Progress" },
    { label: "Completed", value: "Completed" },
  ];

  // -----Caching Offline PD Records----------
  // const cacheOfflineHandler = async () => {
  //   try {
  //     // console.log("pressed", selectedCacheItems);
  //     await promises.clearSoup(false, soupConfig.PDList.soupName);
  //     await promises.clearSoup(false, soupConfig.PDForm.soupName);
  //     await updateRecordOffline(
  //       selectedCacheItems,
  //       soupConfig.PDList.objectName,
  //       soupConfig.PDList.soupName,
  //       soupConfig.PDList.SMARTSTORE_CHANGED,
  //       true
  //     );
  //     for (let i = 0; i < selectedCacheItems?.length; i++) {
  //       console.log("PD Id", selectedCacheItems[i].Id);
  //       let res = await GetQuestionsJson(
  //         selectedCacheItems[i].Id,
  //         "PersonalDiscussion"
  //       );
  //       if (res.isSuccess) {
  //         Toast.show({
  //           type: "success",
  //           text1: "Offline Record Cached Successfully",
  //           position: "top",
  //         });
  //         let formattedJson = await FormatFormJson(res.responseData);
  //         await updateRecordOffline(
  //           { Id: selectedCacheItems[i].Id, PD: formattedJson },
  //           soupConfig.PDForm.objectName,
  //           soupConfig.PDForm.soupName,
  //           soupConfig.PDForm.SMARTSTORE_CHANGED
  //         );
  //         console.log("JSON......", {
  //           Id: selectedCacheItems[i].Id,
  //           PD: formattedJson,
  //         });
  //       } else {
  //         console.log("Error Fetching PD form Data", res.errorMessage);
  //       }
  //     }
  //   } catch (error) {
  //     console.log("Error cacheOfflineHandler", error);
  //   }
  // };

  return (
    <>
      <View style={PdListStyles.menuViewContainer}>
        <Touchable onPress={openMenu} style={PdListStyles.anchorViewContainer}>
          <Text style={PdListStyles.statusTextStyle} numberOfLines={1}>
            Filter
          </Text>

          <Icon
            name="filter"
            size={12}
            color={colors.black}
            style={PdListStyles.iconViewStyle}
          />
        </Touchable>

        <Portal>
          <Dialog visible={visible} onDismiss={handleCloseFilters}>
            <Dialog.Title>
              <Text>Filter</Text>
            </Dialog.Title>
            <Dialog.ScrollArea>
              {/* <List.Section>
                <ScrollView style={PdListStyles.scrollContainer}>
                  {PdTypeValues &&
                    PdTypeValues.map((item) => (
                      <List.Item
                        onPress={() => selectFilterHandler(item)}
                        key={item.label}
                        titleNumberOfLines={2}
                        title={item.label}
                        style={
                          pdTypeFilter === item.label
                            ? { backgroundColor: colors.selectedItemColor }
                            : null
                        }
                      />
                    ))}
                </ScrollView>
              </List.Section> */}
              <View style={{ margin: moderateScale(5) }}>
                {/* ---------------------------------------------------PD Type Filter------------------------------- */}
                <View style={{ marginVertical: verticalScale(8) }}>
                  <Text
                    style={[
                      PdListStyles.statusTextStyle,
                      { marginBottom: verticalScale(8) },
                    ]}
                    numberOfLines={1}
                  >
                    PD Type
                  </Text>

                  {PdTypeValues?.map((PdTypeValue, index) => (
                    <View
                      style={PdListStyles.radioContainer}
                      key={PdTypeValue.value}
                    >
                      <RadioButton
                        value={PdTypeValue.value}
                        // disabled={isDisabled}
                        status={
                          localFilters.localPdType === PdTypeValue.value
                            ? "checked"
                            : "unchecked"
                        }
                        onPress={() => {
                          // setPdTypeFilter(PdTypeValue?.value);
                          handleFilterChange("localPdType", PdTypeValue?.value);
                        }}
                      />

                      <Text
                        style={PdListStyles.radioLabel}
                        onPress={() => {
                          // setPdTypeFilter(PdTypeValue?.value);
                          handleFilterChange("localPdType", PdTypeValue?.value);
                        }}
                      >
                        {PdTypeValue?.label}
                      </Text>
                    </View>
                  ))}
                </View>
                {/* ---------------------------------------------------PD Status Filter------------------------------- */}

                <View style={{ marginVertical: verticalScale(8) }}>
                  <Text
                    style={[
                      PdListStyles.statusTextStyle,
                      { marginBottom: verticalScale(8) },
                    ]}
                    numberOfLines={1}
                  >
                    PD Status
                  </Text>

                  {PdStatusValues?.map((PdStatusValue, index) => (
                    <View
                      style={PdListStyles.radioContainer}
                      key={PdStatusValue.value}
                    >
                      <RadioButton
                        value={PdStatusValue.value}
                        // disabled={isDisabled}
                        status={
                          localFilters.localPdStatus === PdStatusValue.value
                            ? "checked"
                            : "unchecked"
                        }
                        onPress={() => {
                          // setPdStatusFilter(PdStatusValue?.value);
                          handleFilterChange(
                            "localPdStatus",
                            PdStatusValue?.value
                          );
                        }}
                      />

                      <Text
                        style={PdListStyles.radioLabel}
                        onPress={() => {
                          // setPdStatusFilter(PdStatusValue?.value);
                          handleFilterChange(
                            "localPdStatus",
                            PdStatusValue?.value
                          );
                        }}
                      >
                        {PdStatusValue?.label}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </Dialog.ScrollArea>
            <Dialog.Actions>
              <Button mode="text" onPress={handleCloseFilters}>
                Cancel
              </Button>
              <Button mode="text" onPress={handleApplyFilters}>
                Apply
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        {/* <View style={PdListStyles.cacheOfflineBtn}>
          <Button
            style={PdListStyles.button}
            icon="download"
            mode="contained"
            disabled={isCacheBtnDisabled}
            onPress={cacheOfflineHandler}
          >
            Cache Offline
          </Button>
        </View> */}
      </View>
      <View style={{ flexDirection: "row" }}>
        {pdTypeFilter !== "All" && (
          <Chip
            // key={index}
            icon="close-circle"
            onPress={() => setPdTypeFilter("All")}
            style={{
              marginRight: horizontalScale(4),
              // marginVertical: verticalScale(3),
            }}
          >
            Type: {pdTypeFilter}
          </Chip>
        )}
        {pdStatusFilter !== "All" && (
          <Chip
            // key={index}
            icon="close-circle"
            onPress={() => setPdStatusFilter("All")}
            style={{
              marginRight: horizontalScale(4),
              // marginVertical: verticalScale(3),
            }}
          >
            Status: {pdStatusFilter}
          </Chip>
        )}
      </View>
    </>
  );
};

export default Filter;
