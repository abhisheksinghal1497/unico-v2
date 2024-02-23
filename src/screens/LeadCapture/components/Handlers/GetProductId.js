export const GetProductId = (productMappingData, productSubType) => {
  if (productSubType) {
    let product = productMappingData.find(
      (product) => product?.Name === productSubType
    );

    return product ? product?.Id : '';
  }
  return '';
};
export const GetProductSubTypeName = (productMappingData, productId) => {
  if (productId) {
    let product = productMappingData.find(
      (product) => product?.Id === productId
    );

    return product ? product?.Name : '';
  }
  return '';
};
