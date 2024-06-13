import { net } from "react-native-force";

export const QueryObject = (query) => {
  return new Promise((resolve, reject) => {
    net.query(
      query,
      (res) => {
        resolve(res);
      },
      (error) => {
        reject(error);
      }
    );
  });
};
