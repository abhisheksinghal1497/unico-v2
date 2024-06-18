import { net } from "react-native-force";

export const DedupeApi = (LeadId) => {
  let data = { recordId: LeadId };
  return new Promise((resolve, reject) => {
    net.sendRequest(
      "/services/apexrest",
      `/DedupeLead?recordId=${LeadId}`,
      (res) => {
        // console.log("Entered");
        console.log("res", res);
        resolve(res);
      },
      (error) => {
        reject(error);
      },
      "GET"
    );
  });
  //   const otpValue = '123456';
  //   return otpValue;
};
export const TestApi = (LeadId) => {
  let data = { recordId: LeadId };
  return new Promise((resolve, reject) => {
    net.collectionRetrieve(
      "Lead",
      [],
      ["Id", "FirstName"],
      (res) => {
        resolve(res);
        console.log("Api Hit Res----", res);
      },
      (err) => {
        reject(err);
        console.log("Api Hit Err----", err);
      }
    );
    // net.sendRequest(
    //   "/services/apexrest",
    //   `/DedupeLead?recordId=${LeadId}`,
    //   (res) => {
    //     // console.log("Entered");
    //     console.log("res", res);
    //     resolve(res);
    //   },
    //   (error) => {
    //     reject(error);
    //   },
    //   "GET"
    // );
  });
  //   const otpValue = '123456';
  //   return otpValue;
};
