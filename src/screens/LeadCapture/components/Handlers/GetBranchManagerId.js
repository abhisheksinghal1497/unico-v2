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
