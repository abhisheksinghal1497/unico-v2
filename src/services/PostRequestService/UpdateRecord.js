import { net } from 'react-native-force';

export const updateObjectData = (objectName, data, id) => {
  return new Promise((resolve, reject) => {
    net.sendRequest(
      '/services/data/',
      `${net.getApiVersion()}/sobjects/${objectName}/${id}`,
      () => {
        // console.log('response Patch', res);
        let res = { success: true, id: id };
        resolve(res);
      },
      (error) => {
        reject(error);
      },
      'PATCH',
      data
    );
  });
};
