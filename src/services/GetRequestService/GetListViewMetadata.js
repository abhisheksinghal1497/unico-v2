import { net } from 'react-native-force';

export const GetListViewMetadata = (url) => {
  return new Promise((resolve, reject) => {
    net.sendRequest(
      '/services/data/',
      `${url}`,
      (res) => {
        resolve(res);
        // console.log('Url After Formatting ', url);
        // console.log('ListView Metadata', res);
      },
      (error) => {
        reject(error);
        console.log('ListView Metadata Error', error);
      }
    );
  });
};
