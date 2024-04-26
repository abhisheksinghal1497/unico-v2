import React from "react";
import Icon from "react-native-vector-icons/AntDesign";
import { Text, View } from "react-native";
import { LeadListStyles } from "../styles/LeadListStyles";
import StatusCard from "./statusCard";
import { colors } from "../../../common/colors";
import Touchable from "../../../common/components/TouchableComponent/Touchable";
import { formatDateToDDMMYYYY } from "../../../common/functions/FormatDate";
import { StyleSheet } from "react-native";

const LeadItem = ({ leadData, handleRenderItem, isOnline }) => {
  const current_date = formatDateToDDMMYYYY(leadData.CreatedDate);
  const htmlString = leadData ? leadData?.Status_Code__c : "";

  function extractStatusName(htmlString) {
    // Regular expression to match the status name in the src attribute
    const regex = /\/LeadColorCode\/([^\/]+)\.svg/;

    // Use the regex to find a match in the HTML string
    const match = htmlString?.match(regex);

    // Check if a match is found
    if (match && match[1]) {
      // Extracted status name
      let sName = match[1];
      // Add spacing after every capital letter
      const formattedStatusName = sName?.replace(/([A-Z])/g, " $1").trim();

      return formattedStatusName;
    } else {
      // Return null if no match is found
      return "";
    }
  }
  const statusName = extractStatusName(htmlString);
  // Define a regular expression to match the content inside anchor tags
  // const regex = /<a [^>]*>(.*?)<\/a>/;
  // Use the regular expression to extract the value
  // const match = htmlString ? htmlString.match(regex) : '';
  // let loanApplicationNum = leadData?.hasOwnProperty('LoanApplication__c')
  //   ? leadData?.LoanApplication__c
  //   : null;
  // Extracted value will be in match[1]
  // console.log('-loanApplicationNum------------>', loanApplicationNum);
  // console.log("Lead Data", leadData);
  // const leadId = match ? match[1] : null;
  return (
    <Touchable
      style={styles.item}
      onPress={() => handleRenderItem(leadData.Id, statusName)}
    >
      <View style={styles.headWrapper}>
        <View style={styles.idWrapper}>
          <Text style={styles.id}>
            {leadData?.LeadIdFormula__c ? leadData?.LeadIdFormula__c : ""}
          </Text>
        </View>

        <View>
          <StatusCard status={statusName} />
        </View>
      </View>

      <View style={styles.nameDateWrapper}>
        <View>
          <Text style={styles.fullName}>{`${
            leadData?.FirstName ? leadData.FirstName : ""
          } ${leadData?.LastName ? leadData.LastName : ""}`}</Text>

          <Text style={styles.date}>{current_date}</Text>
        </View>

        <View>
          <Text style={styles.branchChannelName}>
            {leadData?.Bank_Branch__r ? leadData?.Bank_Branch__r?.Name : ""}
          </Text>

          <Text style={styles.branchChannelName}>
            {leadData?.Channel_Name__r ? leadData?.Channel_Name__r?.Name : ""}
          </Text>
        </View>
      </View>
    </Touchable>
  );
  // return (
  //   <Touchable onPress={() => handleRenderItem(leadData.Id)}>
  //     <View style={LeadListStyles.itemViewContainer}>
  //       <View style={LeadListStyles.leadIdView}>
  //         {isOnline && (
  //           <Text style={LeadListStyles.leadIdTextStyle}>{leadId}</Text>
  //         )}
  //         <Text
  //           style={
  //             isOnline
  //               ? LeadListStyles.statusTextStyle
  //               : LeadListStyles.leadIdTextStyle
  //           }
  //         >{`${leadData?.FirstName ? leadData.FirstName : ''} ${
  //           leadData?.LastName ? leadData.LastName : ''
  //         }`}</Text>
  //       </View>
  //       <View style={LeadListStyles.statusView}>
  //         <StatusCard
  //           status={loanApplicationNum ? loanApplicationNum : leadData.Status}
  //         />

  //         <Text
  //           style={[
  //             LeadListStyles.statusTextStyle,
  //             { color: colors.secondaryText },
  //           ]}
  //         >
  //           {current_date}
  //         </Text>
  //       </View>
  //       <View>
  //         <Icon name="right" size={18} color={colors.bgDark} />
  //       </View>
  //     </View>
  //   </Touchable>
  // );
};
export default React.memo(LeadItem);

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#fff",

    // paddingHorizontal: 16,

    paddingTop: 40,
  },

  item: {
    // margin: 16,

    backgroundColor: colors.bgLight,

    padding: 10,

    marginVertical: 8,

    borderRadius: 10,

    shadowColor: "#000",

    shadowOffset: {
      width: 20,

      height: 2,
    },

    shadowOpacity: 0.25,

    shadowRadius: 3.84,

    elevation: 5,
  },

  headWrapper: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    borderBottomWidth: 0.5,

    borderBottomColor: "#c0c0c0",

    paddingBottom: 5,
  },

  nameDateWrapper: {
    marginTop: 5,

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },

  branchChannelName: {
    fontSize: 14,

    color: "black",
    textAlign: "right",
  },

  status: {
    color: "black",

    fontSize: 12,

    borderRadius: 5,

    padding: 5,
  },

  id: {
    color: "black",

    fontSize: 18,

    fontWeight: "bold",
  },

  date: {
    color: "gray",

    fontSize: 14,
  },

  fullName: {
    fontSize: 14,

    fontWeight: "bold",

    color: "black",
  },
});
