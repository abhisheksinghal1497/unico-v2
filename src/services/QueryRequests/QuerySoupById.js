import { smartstore } from 'react-native-force';

export const QuerySoupById = (soupName, queryPath, matchKey, pageSize) => {
  const querySpec = smartstore.buildExactQuerySpec(
    queryPath,
    matchKey,
    pageSize
  );
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
