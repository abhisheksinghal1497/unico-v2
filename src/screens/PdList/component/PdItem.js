import React from "react";
import Icon from "react-native-vector-icons/AntDesign";
import { Text, View } from "react-native";
import { PdListStyles } from "../styles/PdListStyles";
import StatusCard from "./statusCard";
import { colors } from "../../../common/colors";
import Touchable from "../../../common/components/TouchableComponent/Touchable";
import CustomCheckbox from "../../../common/components/CustomCheckBoxComponent";

const PdItem = ({ pdData, handleRenderItem }) => {
  // ----------------------------------------
  const formatDate = (inputDateString) => {
    const parts = inputDateString.match(/\d+/g);
    if (parts && parts.length >= 3) {
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]);
      const day = parseInt(parts[2]);

      // Check if the parsed values are valid
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return `${day.toString().padStart(2, "0")}/${month
          .toString()
          .padStart(2, "0")}/${year}`;
      }
    }
    return "Invalid Date";
  };

  const sch_date = formatDate(pdData?.SchDate__c);

  function getApplicantType(code) {
    switch (code) {
      case "P":
        return "Applicant";
      case "C":
        return "Co-applicant";
      case "G":
        return "Guarantor";
      case "true":
        return "Completed";
      case "false":
        return "Pending";
      default:
        return "";
    }
  }
  function getPDStatus(code) {
    if (code) {
      return "Completed";
    }
    return "Pending";
  }
  // console.log("Loan Application Status", pdData?.LoanAppl__r?.Status__c);
  return (
    <View style={PdListStyles.itemViewContainer}>
      {/* <View style={PdListStyles.checkBox}>
        <CustomCheckbox
          status={isSelected}
          onPressCheckBox={() => toggleSelection(pdData)}
        />
      </View> */}
      <Touchable
        onPress={() =>
          handleRenderItem(
            pdData?.Id,
            pdData?.IsCompleted__c,
            pdData?.LoanAppl__r?.Status__c
          )
        }
      >
        <View style={PdListStyles.pdItemViewContainer}>
          <View style={PdListStyles.pdIdView}>
            <Text style={PdListStyles.pdIdTextStyle}>
              {`${pdData?.Appl__r.TabName__c ? pdData.Appl__r.TabName__c : ""}`}
            </Text>
            <Text style={PdListStyles.statusTextStyle}>
              {pdData?.LoanAppl__r.Name}, {pdData?.PdTyp__c}
            </Text>
          </View>
          <View style={PdListStyles.statusView}>
            <StatusCard
              ApplType={getApplicantType(pdData?.Appl__r.ApplType__c)}
            />

            <Text
              style={[
                PdListStyles.statusTextStyle,
                { color: colors.secondaryText },
              ]}
            >
              {sch_date}
            </Text>
            <StatusCard ApplType={pdData?.PDStatus__c} />
          </View>
          <View>
            <Icon name="right" size={18} color={colors.bgDark} />
          </View>
        </View>
      </Touchable>
    </View>
  );
};
export default React.memo(PdItem);
