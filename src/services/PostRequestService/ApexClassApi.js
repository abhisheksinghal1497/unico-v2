import { net } from 'react-native-force';

export const DedupeApi = (LeadId) => {
  let data = { recordId: LeadId };
  return new Promise((resolve, reject) => {
    net.sendRequest(
      '/services/apexrest',
      `/DedupeLead?recordId=${LeadId}`,
      (res) => {
        // console.log("Entered");
        console.log('res', res);
        resolve(res);
      },
      (error) => {
        reject(error);
      },
      'GET'
    );
  });
  //   const otpValue = '123456';
  //   return otpValue;
};
