import { net } from 'react-native-force';

export const compositeApi = (data) => {
  return new Promise((resolve, reject) => {
    // console.log('compositeGraphApi data', data);
    net.sendRequest(
      '/services/data/',
      `${net.getApiVersion()}/composite`,
      (res) => {
        resolve(res);
      },
      (error) => {
        console.log('Error', error);
        reject(error);
      },
      'POST',
      data
    );
  });
};
