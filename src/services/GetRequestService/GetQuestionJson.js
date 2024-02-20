import { net } from 'react-native-force';

export const GetQuestionsJson = (recordId, type) => {
  return new Promise((resolve, reject) => {
    net.sendRequest(
      '/services/apexrest',
      //   `/reterieveQuestions?recordId=a0wC4000000Grd3IAC&category=PersonalDiscussion`,
      `/reterieveQuestions?recordId=${recordId}&category=${type}`,
      (res) => {
        // console.log('Entered Question JSON');
        // console.log('res Question JSON', res);
        resolve(res);
      },
      (error) => {
        reject(error);
      },
      'GET'
    );
  });
};
