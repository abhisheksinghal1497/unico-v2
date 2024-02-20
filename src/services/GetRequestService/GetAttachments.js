import { net } from 'react-native-force';

export const GetAttachment = (id) => {
  //console.log("id", id)
  return new Promise((resolve, reject) => {
    net.sendRequest(
      '/services/data',
      `/${net.getApiVersion()}/sobjects/ContentVersion/${id}/VersionData`,
      (blobData) => {
        //console.log("res", blobData);
        resolve(blobData);
      },
      (err) => {
        console.log('Error GetAttachment', err);
        reject(err);
      },
      'GET',
      {},
      {},
      {},
      true
    );
  });
};
