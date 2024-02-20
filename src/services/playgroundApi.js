import { net } from 'react-native-force';

export const ListViews = async () => {
  net.sendRequest(
    '/services/data',
    `/${net.getApiVersion()}/sobjects/Lead/listviews`,
    (res) => {
      let list = String(res?.listviews[0]?.resultsUrl)
        .split('/')
        .splice(3)
        .join('/');
      // .join('/');
      console.log('List Views', list, res);
      net.sendRequest(
        '/services/data',
        `${list}`,
        (res) => {
          //   console.log('Response List', res?.records);
          const outputArray = [];
          const inputArray = res?.records.map((value, index) => {
            const outputObject = {};

            value?.columns.forEach((item) => {
              const fieldName = item.fieldNameOrPath;
              const value = item.value;
              outputObject[fieldName] = value;
            });

            outputArray.push(outputObject);

            // console.log(outputArray);
          });
          //   res?.records.map((value, index, arr) => {
          //     // console.log(value, index, arr);

          //   });
        },
        (err) => {
          console.log('Error', err);
        }
      );
    },
    (error) => {
      console.log('Error List Views ', error);
    }
  );
};
