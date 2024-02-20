import { oauth } from 'react-native-force';

export const Logout = () => {
  return new Promise((resolve, reject) => {
    oauth.logout(
      (res) => resolve(res),
      (err) => reject(err)
    );
  });
};
