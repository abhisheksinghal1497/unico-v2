import { net } from 'react-native-force';

export const GetListViews = (objectType) => {
  return new Promise((resolve, reject) => {
    net.sendRequest(
      '/services/data',
      `/${net.getApiVersion()}/sobjects/${objectType}/listviews`,
      (res) => {
        //  console.log('List Views', res);
        resolve(res?.listviews);
      },
      (error) => {
        reject(error);
        //  console.log('Error List Views ', error);
      }
    );
  });
};
