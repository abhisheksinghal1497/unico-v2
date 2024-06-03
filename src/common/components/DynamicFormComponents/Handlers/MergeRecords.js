const mergeFieldValues = (existingValue, newValue) => {
  return newValue || existingValue;
};
export const MergeRecords = (apexReqData) => {
  const groupedRecords = new Map();
  apexReqData.forEach((obj) => {
    const objectType = obj?.objectType;
    if (groupedRecords.has(objectType)) {
      const existingRecord = groupedRecords.get(objectType);
      const matchingRecord = existingRecord?.records.find(
        (record) => record?.Id === obj?.records[0]?.Id
      );

      if (
        matchingRecord &&
        matchingRecord?.attributes?.type !== 'PDPrtcpnts__c'
      ) {
        Object.keys(obj?.records[0]).forEach((field) => {
          matchingRecord[field] = mergeFieldValues(
            matchingRecord[field],
            obj?.records[0][field]
          );
        });
      } else {
        existingRecord?.records.push(obj.records[0]);
      }
    } else {
      groupedRecords.set(objectType, { ...obj });
    }
  });
  const resultArray = Array.from(groupedRecords.values());

  //  console.log('resultArray', resultArray);
  //  resultArray.map((res) => console.log('Object Type', res.objectType));
  // ----------------------------------------------
  return resultArray;
};
