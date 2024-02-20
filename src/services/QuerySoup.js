import { smartstore } from 'react-native-force';

export const QuerySoup = (soupName, queryPath, pageSize) => {
  const querySpec = smartstore.buildAllQuerySpec(queryPath, null, pageSize);
  return new Promise((resolve, reject) => {
    smartstore.soupExists(
      false,
      soupName,
      (soupExist) => {
        soupExist
          ? smartstore.querySoup(
              false,
              soupName,
              querySpec,
              (res) => {
                // console.log('Location Master data', res);
                resolve(res.currentPageOrderedEntries);
              },
              (error) => {
                console.log('Query Soup Error', error);
                reject(error);
              }
            )
          : resolve([]);
      },
      (error) => {
        reject(error);
      }
    );
  });
};
