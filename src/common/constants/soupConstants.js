export const soupConfig = {
  locationMaster: {
    soupName: 'locationMasterSoup',
    queryPath: 'Id',
    SMARTSTORE_CHANGED: 'smartstoreChanged',
    syncDownName: 'locationMasterSyncDown',
    objectName: 'Location Master',
    pageSize: 100000,
  },
  customerMaster: {
    soupName: 'customerMasterSoup',
    queryPath: 'Id',
    SMARTSTORE_CHANGED: 'smartstoreChanged',
    syncDownName: 'customerMasterSyncDown',
    objectName: 'Customer Master',
    pageSize: 100000,
  },
  bankBranchMaster: {
    soupName: 'bankBranchMasterSoup',
    queryPath: 'Id',
    SMARTSTORE_CHANGED: 'smartstoreChanged',
    syncDownName: 'bankBranchSyncDown',
    objectName: 'Bank Branch Master',
    pageSize: 100000,
  },
  locationBrJnMaster: {
    soupName: 'locationBrJnSoup',
    queryPath: 'Id',
    SMARTSTORE_CHANGED: 'smartstoreChanged',
    syncDownName: 'locationBrJnSyncDown',
    objectName: 'Location Branch Jn Master',
    pageSize: 100000,
  },
  pincodeMaster: {
    soupName: 'pincodeSoup',
    queryPath: 'Id',
    SMARTSTORE_CHANGED: 'smartstoreChanged',
    syncDownName: 'pincodeSyncDown',
    objectName: 'Pincode Master',
    pageSize: 100000,
  },
  teamHierarchy: {
    soupName: 'teamHierarchy',
    queryPath: 'Id',
    SMARTSTORE_CHANGED: 'smartstoreChanged',
    syncDownName: 'teamHierarchySyncDown',
    objectName: 'Team Heirarchy',
    pageSize: 100000,
  },
  productMapping: {
    soupName: 'productMapping',
    queryPath: 'Id',
    SMARTSTORE_CHANGED: 'smartstoreChanged',
    syncDownName: 'productMappingSyncDown',
    objectName: 'Product Mapping',
    pageSize: 100000,
  },
  dsaBrJn: {
    soupName: 'dsaBrJn',
    queryPath: 'Id',
    SMARTSTORE_CHANGED: 'smartstoreChanged',
    syncDownName: 'dsaBrJnSyncDown',
    objectName: 'DSA Branch Junction',
    pageSize: 100000,
  },
  userInfo: {
    soupName: 'userInfo',
    queryPath: 'Id',
    SMARTSTORE_CHANGED: 'smartstoreChanged',
    syncDownName: 'userInfoSyncDown',
    objectName: 'User Info',
    pageSize: 100000,
  },
  leadMetaData: {
    soupName: 'leadMetaData',
    SMARTSTORE_CHANGED: 'smartstoreChanged',
    objectName: 'Lead',
    objectType: 'Lead', // Here give the Object Api Name only
    queryPath: 'name',
    pageSize: 100000,
  },
  lead: {
    syncName: 'leadSyncUp',
    soupName: 'leadSoup',
    SMARTSTORE_CHANGED: 'smartstoreChanged',
    objectName: 'Lead',
    objectType: 'Lead', // Here give the Object Api Name only
    queryPath: 'Id',
    pageSize: 100000,
    fieldList: [
      'Id',
      'LeadSource',
      'Status',
      'RM_SM_Name__c',
      'Channel_Name__c',
      'Branch_Name__c',
      'Employee_Code__c',
      'Customer_Name__c',
      'DSA_Code__c',
      'Bank_Branch__c',
      'Branch_Manager__c',
      'Customer_Profile__c',
      'MobilePhone',
      'Alternative_Mobile_Number__c',
      'FirstName',
      'MiddleName',
      'LastName',
      'Email',
      'Residential_Address__c',
      'Pincode__c',
      'Product__c',
      'ProductLookup__c',
      'Property_Identified__c',
      'Requested_loan_amount__c',
      'Requested_tenure_in_Months__c',
      'OwnerId',
      'Is_OTP_Limit_Reached__c',
      'Last_OTP_Attempt_Time__c',
      'OTP_Attempts__c',
      'OTP_Verified__c',
    ],
  },
  contentVersion: {
    syncName: 'contentVesrionSyncUp',
    soupName: 'contentVersionSoup',
    SMARTSTORE_CHANGED: 'smartstoreChanged',
    objectName: 'ContentVersion',
    objectType: 'ContentVersion', // Here give the Object Api Name only
    queryPath: 'FirstPublishLocationId',
    pageSize: 100000,
    fieldList: [
      'Id',
      'Title',
      'PathOnClient',
      'ContentLocation',
      'FirstPublishLocationId',
      'VersionData',
    ],
  },
};
