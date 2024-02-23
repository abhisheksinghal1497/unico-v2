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
    // console.log('Th Data', th);
    return th ? th?.BanchBrch__r.Name : '';
  }

  return '';
};
export const GetRmIdByRmName = (thData, rmName) => {
  if (thData && thData?.length > 0) {
    let th = thData?.find((t) => t.Employee__r.Name === rmName);
    // console.log('Th Data', th);
    return th ? th?.Employee__c : '';
  }

  return '';
};
