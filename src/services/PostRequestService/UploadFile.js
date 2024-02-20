import { net } from 'react-native-force';

const UploadFile = (fileName, fileExtension, size, blobData, id) => {
  return new Promise((resolve, reject) => {
    net.sendRequest(
      '/services/data/',
      `${net.getApiVersion()}/sobjects/ContentVersion`,
      (res) => {
        resolve(res);
      },
      (err) => reject(err),
      'POST',
      {
        Title: fileName,
        FirstPublishLocationId: id,
        ContentLocation: 'S',
        PathOnClient: fileName,
        VersionData: blobData,
      }
    );
  });
};
export default UploadFile;
