export default function isCityServiceable(
  cityName,
  locationMasterData,
  productType
) {
  const city = locationMasterData.find((city) => city.City__c === cityName);
  //   city?.Location_Branch_Junctions__r
  //   console.log('City', city, cityName);
  if (!city || !city.Location_Branch_Junctions__r) return false;
  if (city && city.Location_Branch_Junctions__r?.hasOwnProperty('records')) {
    if (city.Location_Branch_Junctions__r?.records.length > 0) {
      let locations = city.Location_Branch_Junctions__r?.records;
      for (let i = 0; i < locations.length; i++) {
        if (
          productType?.length > 0 &&
          locations[i].ProductType__c.includes(productType) &&
          locations[i].IsActive__c
        ) {
          return true;
        }
      }
      return false;
    } else {
      return false;
    }
  }
  //   return city ? city.IsServiceable__c : false;
}
