import { net } from "react-native-force";

export const postObjectData = (objectName, data) => {
  return new Promise((resolve, reject) => {
    net.sendRequest(
      "/services/data/",
      `${net.getApiVersion()}/sobjects/${objectName}`,
      (res) => {
        resolve(res);
      },
      (error) => {
        reject(error);
      },
      "POST",
      data
    );
  });
};
export const OTPVerificationService = (LeadId, mobileNumber) => {
  return new Promise((resolve, reject) => {
    net.sendRequest(
      "/services/apexrest",
      `/generateOTPMobile?leadId=${LeadId}&mobileNumber=${mobileNumber}`,
      (res) => {
        // console.log("Entered");
        // console.log("res",res);
        resolve(res);
      },
      (error) => {
        reject(error);
      },
      "GET"
    );
  });
  // const otpValue = "123456";
  // return otpValue;
};

export const ValidateOTPService = (taskId, otp) => {
  return new Promise((resolve, reject) => {
    net.sendRequest(
      "/services/apexrest",
      `/validateOTP?taskId=${taskId}&otp=${otp}`,
      (res) => {
        // console.log("Entered");
        // console.log("res",res);
        resolve(res);
      },
      (error) => {
        reject(error);
      },
      "GET"
    );
  });
};

export const SendMsgOnConvertLead = (LeadId, mobileNumber) => {
  return new Promise((resolve, reject) => {
    net.sendRequest(
      "/services/apexrest",
      `/leadConverted?leadId=${LeadId}&mobileNumber=${mobileNumber}`,
      (res) => {
        resolve(res);
      },
      (error) => {
        reject(error);
      },
      "GET"
    );
  });
};
