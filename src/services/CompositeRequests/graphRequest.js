import { net } from 'react-native-force';

export const compositeGraphApi = (graphs) => {
  return new Promise((resolve, reject) => {
    // console.log('compositeGraphApi data', graphs);
    let requestData = {
      graphs,
    };
    net.sendRequest(
      '/services/data/',
      `${net.getApiVersion()}/composite/graph`,
      (res) => {
        resolve(res);
      },
      (error) => {
        console.log('Error', error);
        reject(error);
      },
      'POST',
      requestData
    );
  });
};
