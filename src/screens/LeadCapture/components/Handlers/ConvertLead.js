import { compositeGraphApi } from "../../../../services/CompositeRequests/graphRequest";
import { DedupeApi } from "../../../../services/PostRequestService/ApexClassApi";
import updateLeadoffline from "./UpdateLeadOffline";
import { net } from "react-native-force";
import Toast from "react-native-toast-message";
import { QueryObject } from "../../../../services/QueryObject";
import { query } from "../../../../common/constants/Queries";
import { screens } from "../../../../common/constants/screen";
import { GetProductSubTypeName } from "./GetProductId";
import { SendMsgOnConvertLead } from "../../../../services/PostRequestService/PostObjectData";

export const ConvertLead = async (
  lead,
  setPostData,
  alert,
  setAlert,
  navigation,
  productMappingData
) => {
  try {
    let compositeRequest = [];
    const dedupeRes = await DedupeApi(lead?.Id);
    if (dedupeRes && dedupeRes === "EXACT_MATCH") {
      let leadById = await QueryObject(query.getLeadByIdQuery(lead?.Id));
      leadData =
        leadById?.records?.length > 0 ? { ...leadById?.records[0] } : {};

      setPostData(leadData);

      setAlert({
        visible: true,
        onClickYes: () => {
          setAlert({ ...alert, visible: false });
          navigation.navigate(screens.leadList);
        },
        title: "Duplicate Lead Found. Assigned to Branch Manager",
        onDismiss: () => {},
        confirmBtnLabel: "OK",
        cancelBtnLabel: "",
        ionIconName: "alert-circle-outline",
      });

      // Toast.show({
      //   type: 'error',
      //   text1: 'Duplicate Lead Found',
      //   text2: 'Assigned to Branch Manager',
      //   position: 'top',
      // });
      return {};
    }
    if (dedupeRes && dedupeRes === "Dedupe failed") {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to Convert Lead",
        position: "top",
      });
      return {};
    }

    let data = { Status: "Closed Lead" };
    let leadData = { ...lead, ...data };
    // console.log('Converted lead Data', leadData, lead);

    // console.log('Dedupe res', dedupeRes);
    compositeRequest.push({
      url: `/services/data/${net.getApiVersion()}/sobjects/Lead/${
        leadData?.Id
      }/`,
      body: data,
      method: "PATCH",
      referenceId: "reference_id_lead_upsert_1",
    });

    let loanApplData = {
      BrchCode__c: leadData?.Branch_Code__c,
      Bank_Branch_Name__c: leadData?.Bank_Branch__c,
      ChanelNme__c: leadData?.Channel_Name__c,
      LeadSource__c: leadData?.LeadSource,
      Lead__c: leadData?.Id,
      ProductSubType__c: GetProductSubTypeName(
        productMappingData,
        leadData?.ProductLookup__c
      ),
      Product__c: leadData?.Product__c,
      RMSMName__c: leadData?.RM_SM_Name__c,
      ReqLoanAmt__c: leadData?.Requested_loan_amount__c,
      ReqTenInMonths__c: leadData?.Requested_tenure_in_Months__c,
      Stage__c: "QDE",
      SubStage__c: "RM Data Entry",
    };
    compositeRequest.push({
      url: `/services/data/${net.getApiVersion()}/sobjects/LoanAppl__c/`,
      body: loanApplData,
      method: "POST",
      referenceId: "reference_id_loan_appl_create_1",
    });

    let applicantData = {
      CustProfile__c: leadData?.Customer_Profile__c,
      EmailId__c: leadData?.Email,
      FName__c: leadData?.FirstName,
      LName__c: leadData?.LastName,
      MName__c: leadData?.MiddleName,
      MobNumber__c: leadData?.MobilePhone,
    };

    compositeRequest.push({
      url: `/services/data/${net.getApiVersion()}/sobjects/Applicant__c/`,
      body: {
        ...applicantData,
        LoanAppln__c: "@{reference_id_loan_appl_create_1.id}",
      },
      method: "POST",
      referenceId: "reference_id_applicant_create_1",
    });

    // Get Loan Application Number

    compositeRequest.push({
      url: `/services/data/${net.getApiVersion()}/sobjects/LoanAppl__c/@{reference_id_loan_appl_create_1.id}?fields=Id,Name`,
      method: "GET",
      referenceId: "reference_id_loan_appl_get_1",
    });

    // Get Lead Id Number

    compositeRequest.push({
      url: `/services/data/${net.getApiVersion()}/sobjects/Lead/${
        leadData?.Id
      }?fields=Id,Lead_Id__c,LeadIdFormula__c`,
      method: "GET",
      referenceId: "reference_id_lead_get_1",
    });

    let graphRes = await compositeGraphApi([
      {
        graphId: "1",
        compositeRequest,
      },
    ]);
    // console.log("Graph Res", graphRes);
    if (graphRes?.graphs[0].isSuccessful) {
      leadData.fileDetails = [];
      // console.log('graph res success');
      await updateLeadoffline(leadData);
      await SendMsgOnConvertLead(leadData?.Id, leadData?.MobilePhone);

      return {
        leadData,
        loanAppNo: graphRes?.graphs[0].graphResponse.compositeResponse.find(
          (value) => value.referenceId === "reference_id_loan_appl_get_1"
        )?.body,
        leadId: graphRes?.graphs[0].graphResponse.compositeResponse.find(
          (value) => value.referenceId === "reference_id_lead_get_1"
        )?.body,
      };
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to Convert Lead",
        position: "top",
      });
      return {};
    }
  } catch (error) {
    console.log("Error ConvertLead", error);
    Toast.show({
      type: "error",
      text1: "Error",
      text2: "Failed to Convert Lead",
      position: "top",
    });
    return {};
  }
};
