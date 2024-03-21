export const GetChannelId = (channelList, channelName) => {
  try {
    if (channelName && channelName.length > 0 && channelList) {
      let channelDetails = channelList?.filter(
        (value) => value.Account__r.Name === channelName
      );
      return channelDetails && channelDetails?.length > 0
        ? channelDetails[0]?.Account__c
        : '';
    } else {
      return '';
    }
  } catch (error) {
    console.log('Error GetChannelId', error);
    // return '';
  }
};

export const GetRmSmName = (thData, rmId) => {
  if (thData && thData?.length > 0) {
    let th = thData?.find((t) => t.Employee__c === rmId);
    // console.log('Th Data', th);
    return th ? th?.Employee__r.Name : '';
  }

  return '';
};
export const GetRmBranchName = (thData, rmId) => {
  if (thData && thData?.length > 0) {
    let th = thData?.find((t) => t.Employee__c === rmId);
    console.log('Th Data', th);
    return th ? th?.EmpBrch__r?.Name : '';
  }

  return '';
};
export const GetRmIdByRmName = (thData, rmName) => {
  if (thData && thData?.length > 0) {
    let th = thData?.find((t) => t.Employee__r.Name === rmName);
    console.log('Th Data', th);
    return th ? th?.Employee__c : '';
  }

  return '';
};

export const GetBrIdByBrName = (pincodeMasterData, brname) => {
  try {
    let br = pincodeMasterData.find(
      (pin) => pin?.Bank_Branch__r?.Name === brname
    );
    // console.log('Branch Name');
    if (br) {
      return br?.Bank_Branch__c;
    } else {
      return '';
    }
  } catch (error) {
    console.log('Error GetBrIdByBrName', error);
    return '';
  }
};
export const GetBrNameByBrId = (pincodeMasterData, brId) => {
  try {
    let br = pincodeMasterData.find((pin) => pin?.Bank_Branch__c === brId);

    if (br) {
      return br?.Bank_Branch__r.Name;
    } else {
      return '';
    }
  } catch (error) {
    console.log('Error GetBrIdByBrName', error);
    return '';
  }
};
