import { net, oauth } from 'react-native-force';

export const QueryMoreObject = (url) => {
  return new Promise((resolve, reject) => {
    oauth.getAuthCredentials(
      (res) => {
        // console.log('Credentials', res);
        net.queryMore(
          `${res?.instanceUrl}${url}`,
          (res) => {
            resolve(res);
          },
          (error) => {
            reject(error);
          }
        );
      },
      (error) => {
        reject(error);
      }
    );
  });
};
