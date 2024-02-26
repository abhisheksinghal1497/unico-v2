import * as React from "react";
import { Text, Button } from "react-native-paper";
import { ScrollView, View } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

import { useNavigation } from "@react-navigation/native";
import { convertedLeadStyle } from "./styles/LeadConvertedStyle";
import { colors } from "../../../../common/colors";

const LeadConverted = ({ handleConvertButton, LeadCaptureData }) => {
  const { leadData, loanAppNo } = LeadCaptureData;
  console.log("loanAppNo------>", loanAppNo);
  const navigation = useNavigation();

  const {
    MobilePhone,
    Email,
    FirstName,
    LastName,
    Product__c,
    CurrentResidenceCity__City__s,
    OfficeAddressCity__City__s,
    Constitution__c,
    Company,
  } = leadData || {};
  const Name =
    Constitution__c === "INDIVIDUAL" ? FirstName + " " + LastName : Company;
  const Address =
    Constitution__c === "INDIVIDUAL"
      ? CurrentResidenceCity__City__s
      : OfficeAddressCity__City__s;
  const handleLoanIdPress = async () => {
    try {
      navigation.navigate(screens.WebViewStack, { endUrl: loanAppNo?.Name });
    } catch (error) {
      console.log("Error handleLoanIdPress", error);
    }
  };
  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ flex: 1, paddingVertical: 24 }}>
        <View style={{ alignItems: "center" }}>
          <Icon name="checkcircle" size={40} color={colors.success} />
          <Text
            style={{
              fontFamily: "Inter",
              fontSize: 20,
              fontWeight: "400",
              padding: 12,
            }}
          >
            {"Lead Converted!"}
          </Text>
        </View>
        <View style={{ paddingStart: 55, paddingVertical: 24 }}>
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <Text style={convertedLeadStyle.convertedLabel}>
              {`Loan Application ID:`}
            </Text>
            {/* <Touchable onPress={handleLoanIdPress}> */}
            <Text
              style={convertedLeadStyle.convertedValuesForLoanId}
              // style={convertedLeadStyle.convertedValues}
            >
              {"loanAppNo?.Name"}
            </Text>
            {/* </Touchable> */}
          </View>
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <Text style={convertedLeadStyle.convertedLabel}>{"Name:"}</Text>
            <Text style={convertedLeadStyle.convertedValues}>{"Name"}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <Text style={convertedLeadStyle.convertedLabel}>{"Phone:"}</Text>
            <Text style={convertedLeadStyle.convertedValues}>
              {"+91"} {"MobilePhone"}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <Text style={convertedLeadStyle.convertedLabel}>
              {"Loan Type:"}
            </Text>
            <Text style={convertedLeadStyle.convertedValues}>{"Product__c"}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <Text style={convertedLeadStyle.convertedLabel}>{"City:"}</Text>
            <Text style={convertedLeadStyle.convertedValues}>{"Address"}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <Text style={convertedLeadStyle.convertedLabel}>{"Email:"}</Text>
            <Text style={convertedLeadStyle.convertedValues}>{"Email"}</Text>
          </View>
        </View>
        <Button
          mode="contained"
          style={convertedLeadStyle.convertedButton}
          onPress={handleConvertButton}
        >
          Go to Lead List
        </Button>
      </View>
    </ScrollView>
  );
};
export default LeadConverted;
