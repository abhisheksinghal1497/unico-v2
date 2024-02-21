export const getProductType = (teamHeirarchyByUserId) => {
  try {
    if (
      teamHeirarchyByUserId &&
      Object.keys(teamHeirarchyByUserId)?.length > 0
    ) {
      return {
        productType: String(teamHeirarchyByUserId?.Product_Type__c).split(';'),
        hasError: true,
      };
    } else {
      return { productType: [], hasError: false };
    }
  } catch (error) {
    console.log('Error in get Product Type Function', error);
    return {
      productType: [],
      hasError: true,
    };
  }
};
