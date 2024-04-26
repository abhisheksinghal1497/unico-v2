import { globalConstants } from "../../../../common/constants/globalConstants";

export const GetDefaultValues = (
  teamHeirarchyByUserId,
  dsaBrJnData,
  empRole
) => {
  try {
    let defaultValues = {};
    if (empRole === globalConstants.RoleNames.RM) {
      defaultValues = {
        LeadSource: "",
        Status: "New Lead",
        RM_SM_Name: teamHeirarchyByUserId
          ? teamHeirarchyByUserId?.Employee__r.Name
          : "",
        RM_SM_Name__c: "",
        Channel_Name__c: "",
        Channel_Name: "",
        Branch_Name__c: "",
        Cust_ID__c: "",
        Cust_ID: "",
        // BranchCode__c: '', No need to update as it is a formula field
        Employee_Code__c: "",
        Customer_Name__c: "",
        DSA_Code__c: "",
        DSA_UGA_User__c: "",
        Bank_Branch__c: "", // Branch Name of User Logged in
        Branch_Manager__c: "", //
        Br_Manager_Br_Name: "",
        //-----------Personal details--------------//
        Customer_Profile__c: "",
        MobilePhone: "",
        Alternative_Mobile_Number__c: "",
        FirstName: "",
        MiddleName: "",
        LastName: "",
        Email: "",
        Residential_Address__c: "",
        Pincode__c: "",
        //--------------Loan Details------------//
        Product__c: "",
        ProductLookup__c: "",
        ProductLookup: "",
        Property_Identified__c: "",

        Requested_loan_amount__c: null,
        Requested_tenure_in_Months__c: null,
        // OwnerId: '',
        Is_OTP_Limit_Reached__c: false,
        Last_OTP_Attempt_Time__c: "",
        OTP_Attempts__c: null,
        OTP_Verified__c: false,
        MobilePhoneOtp: "",
        Physical_Application_Number__c: null,
        Company: "default",
      };
      return defaultValues;
    }
    if (empRole === globalConstants.RoleNames.DSA) {
      let dsaBrJn =
        dsaBrJnData && dsaBrJnData.length > 0 ? dsaBrJnData[0] : null;
      // console.log('DSA Br Jn DATA ----->', dsaBrJn);
      defaultValues = {
        LeadSource: "DSA",
        Status: "New Lead",
        RM_SM_Name__c: "",
        Channel_Name__c: dsaBrJn ? dsaBrJn?.Account__c : "",
        Channel_Name: dsaBrJn ? dsaBrJn?.Account__r.Name : "",
        DSA_UGA_User__c: dsaBrJn ? dsaBrJn?.DSAUGA__c : "",
        // BranchCode__c: '', No need to update as it is a formula field
        DSA_Code__c: dsaBrJn ? dsaBrJn?.DSA_UGA_Code__c : "",
        Bank_Branch__c: "", // Branch Name of Branch Selected
        Branch_Manager__c: "", //
        Br_Manager_Br_Name: "",
        //-----------Personal details--------------//
        //    Customer_Profile__c: '',
        MobilePhone: "",
        //    Alternative_Mobile_Number__c: '',
        FirstName: "",
        MiddleName: "",
        LastName: "",
        // Email: '',
        Pincode__c: "",
        //--------------Loan Details------------//
        Product__c: "",
        ProductLookup__c: "",
        ProductLookup: "",
        OwnerId: "",
        Company: "default",
      };
      return defaultValues;
    }
    if (empRole === globalConstants.RoleNames.UGA) {
      let dsaBrJn =
        dsaBrJnData && dsaBrJnData.length > 0 ? dsaBrJnData[0] : null;
      defaultValues = {
        LeadSource: "UGA",
        Status: "New Lead",
        RM_SM_Name__c: "",
        RM_Name: "",
        Channel_Name__c: dsaBrJn ? dsaBrJn?.Account__c : "",
        Channel_Name: dsaBrJn ? dsaBrJn?.Account__r.Name : "",
        DSA_UGA_User__c: dsaBrJn ? dsaBrJn?.DSAUGA__c : "",
        // BranchCode__c: '', No need to update as it is a formula field
        DSA_Code__c: dsaBrJn ? dsaBrJn?.DSA_UGA_Code__c : "",
        Bank_Branch__c: "", // Branch Name of Branch Selected
        Branch_Manager__c: "", //
        Br_Manager_Br_Name: "",
        //-----------Personal details--------------//
        //    Customer_Profile__c: '',
        MobilePhone: "",
        //    Alternative_Mobile_Number__c: '',
        FirstName: "",
        MiddleName: "",
        LastName: "",
        // Email: '',
        Pincode__c: "",
        //--------------Loan Details------------//
        Product__c: "",
        ProductLookup__c: "",
        ProductLookup: "",
        // OwnerId: '',
        Company: "default",
      };
      return defaultValues;
    }
  } catch (error) {
    console.log("Error GetDefaultValues", error);
  }
};
