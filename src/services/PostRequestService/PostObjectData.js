import { net } from 'react-native-force';

 export const postObjectData = (objectName, data) => {
  return new Promise((resolve, reject) => {
    net.sendRequest(
      '/services/data/',
      `${net.getApiVersion()}/sobjects/${objectName}`,
      (res) => {
        resolve(res);
      },
      (error) => {
        reject(error);
      },
      'POST',
      data
    );
  });
};
export const OTPVerificationService = (LeadId, mobileNumber) =>{
  return new Promise((resolve, reject) => {
  net.sendRequest(
    "/services/apexrest" ,
     `/generateOTP?leadId=${LeadId}&mobileNumber=${mobileNumber}`,
      (res) => {
        console.log("Entered");
        console.log("res",res);
        resolve(res);
      },
      (error) => {
        reject(error);
      },
      'GET',
    );
  });
}

