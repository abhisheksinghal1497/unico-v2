import { net } from 'react-native-force';

export const getMetaData = (objectType) => {
  return new Promise((resolve, reject) => {
    net.describe(
      objectType,
      (res) => {
        resolve(res);
      },
      (err) => {
        reject(err);
      }
    );
  });
};
