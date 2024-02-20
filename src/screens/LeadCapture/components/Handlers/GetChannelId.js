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
