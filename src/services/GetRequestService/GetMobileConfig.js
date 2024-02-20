import { net } from 'react-native-force';
import { query } from '../../common/constants/Queries';

export const GetMobileConfig = () => {
  return new Promise((resolve, reject) => {
    net.query(
      `${query?.getMobileConfig}`,
      (res) => {
        resolve(res);
        // console.log('Response', res);
      },
      (error) => {
        reject(error);
        console.log('Error GetMobileConfig', error);
      }
    );
  });
};

export const GetDefaultListView = async () => {
  try {
    let mobileConfig = await GetMobileConfig();

    let defaultList = mobileConfig
      ? JSON.parse(
          String(
            mobileConfig.records.filter(
              (value) => value.Lead_Default_List_View__c === 'Recently Viewed'
            )[0].Lead_Field_List_View_Query__c
          )
        )
      : {};

    return {
      query: defaultList?.queryFields,
      label: 'Recently Viewed',
      describeUrl: '',
      developerName: 'RecentlyViewed',
      default: true,
    };
  } catch (error) {
    console.log('Error GetDefaultListView', error);
  }
};
