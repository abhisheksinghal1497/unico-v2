import { globalConstants } from '../../../../common/constants/globalConstants';

export const GetBrManagerId = (thData, branchName) => {
  try {
    let BankBranchManagers = thData.find(
      (th) =>
        th.EmpRole__c === globalConstants.RoleNames.BrManager &&
        th.EmpBrch__r.Name === branchName
    );

    return BankBranchManagers ? BankBranchManagers.Employee__c : '';
  } catch (error) {
    console.log('Error GetBrManagerId', error);
    return '';
  }
};
export const GetBrManagerBrName = (thData, brManagerId) => {
  try {
    let BankBranchManagers = thData.find(
      (th) =>
        th.EmpRole__c === globalConstants.RoleNames.BrManager &&
        th.Employee__c === brManagerId
    );

    return BankBranchManagers ? BankBranchManagers.EmpBrch__r.Name : '';
  } catch (error) {
    console.log('Error GetBrManagerId', error);
    return '';
  }
};
