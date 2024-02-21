export const query = {
  getLeadsQuery:
    'Select Id, Status, Name, LeadSource, Lead_Id__c,CreatedDate,Branch_Name__c,Channel_Name__c from Lead ORDER BY LASTMODIFIEDDATE DESC',

  getLeadByIdQuery: (id) =>
    `Select Lead_Id__c,Status,LeadSource,IsthisAssessedIncomePrg__c,Channel_Name__c,Company,ConsentType__c,Constitution__c,CurrentResidenceCity__City__s,Customer_Profile__c,DOB__c,Email,FirstName,KeymanName__c,LastName,MobilePhone,OfficeAddressCity__City__s,RationaleUsingPhyConsent__c,DOI__c,Referral_Employee_Code__c,RM_SM_Name__c,Product__c,ProductLookup__c,Property_Identified__c,Property_Category__c,Requested_loan_amount__c,Requested_tenure_in_Months__c,Promotion_Code__c,Disposition_Status__c,Disposition_Remarks__c,Lead_Closure_Reason__c,Is_OTP_Limit_Reached__c,Is_Physical_Consent_Validated__c,Additional_Comments__c,OTP_Verified__c,Comments__c,CreatedDate,PromCodId__c from Lead WHERE Id='${id}' `,
  filterLeadQuery: (status) =>
    `Select Id, Status, Name, LeadSource, Lead_Id__c,CreatedDate from Lead WHERE Status = '${status}' ORDER BY LASTMODIFIEDDATE DESC`,
  getLocationMasterQuery:
    'Select Id,City__c,(Select Id,ProductType__c,IsActive__c from Location_Branch_Junctions__r) from LocMstr__c',
  // "SELECT Id,City__c,IsServiceable__c,State__c FROM LocMstr__c",
  getTeamHierarchyQuery: `SELECT EmpBrch__c,EmpBrch__r.Name,Employee__c,EmpRole__c,FullName__c,Id,IsActive__c,Name,Product_Type__c,Supervisor__c,Employee__r.Name,BranchCode__c,Employee_Code__c FROM TeamHierarchy__c WHERE  IsActive__c = true`,
  // Employee__c = '${userId}' AND
  // getProductMapping: (productType) =>
  //   `SELECT Id,Name,ProdSubType__c,ProdType__c FROM ProdMap__c WHERE ProdType__c IN (${
  //     "'" + productType.join("','") + "'"
  //   }) `,
  getProductMapping: (productType) =>
    `SELECT Id,Name,Family FROM Product2 WHERE Family IN (${
      "'" + productType.join("','") + "'"
    })  AND  IsActive=true`,

  getDsaBranchJunction: (userId) =>
    `SELECT Account__c,Account__r.Name,Account__r.RecordType.name,Account__r.DSAConnId__c
,BanchBrch__c,BanchBrch__r.Name,BanchBrch__r.BrchCode__c,Id,IsActive__c,Name,RMUsr__c,DSA_UGA_Code__c FROM DSABrchJn__c WHERE RMUsr__c = '${userId}' AND IsActive__c = true`,
  getUserInfo: (userId) =>
    `SELECT Id,IsIntrnlUsr__c FROM User WHERE Id = '${userId}'`,

  getLoanApplication: (id) =>
    `SELECT Id, Name FROM LoanAppl__c WHERE Id = '${id}'`,
  getContentVersion: (id) =>
    `select Id,Title,FileType,VersionData,ContentSize from ContentVersion where FirstPublishLocationId='${id}'`,
  getContentDocumentId: (id) =>
    `SELECT Id, ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId ='${id}'`,
  getContentVersionId: (id) =>
    `SELECT Id ,VersionData, Title,ContentSize,FileType from ContentVersion where ContentDocumentId = '${id}'`,
  getCustomerMasterData: `SELECT Id,Name,Customer_Name__c FROM Customer__c`,
  getBankBranchMasterData: `SELECT Id,Name,LocationMaster__c,BrchCode__c FROM BankBrchMstr__c`,
  getLocationBrJnMasterData: `SELECT Id,Name,Location__c,Branch__c FROM LocBrchJn__c  WHERE IsActive__c=true `,
  getPincodeMasterData: `SELECT Id,Name,Bank_Branch__c,PinCode__c,Product_Type__c,Bank_Branch__r.Name,Bank_Branch__r.BrchCode__c,PinCode__r.PIN__c,PinCode__r.State__c,PinCode__r.IsServicable__c FROM PinBrchJn__c where PinCode__r.IsServicable__c=true`,
  // getPincodeMasterData: `SELECT Id,Name,City__c,PIN__c,State__c,IsServicable__c FROM PincodeMstr__c WHERE IsServicable__c=true `,
};
