import { oauth } from 'react-native-force';

export const getAuthCredentials = () => {
  return new Promise((resolve, reject) => {
    oauth.getAuthCredentials(
      (res) => {
        resolve(res);
      },
      (error) => {
        reject(error);
      }
    );
  });
};
