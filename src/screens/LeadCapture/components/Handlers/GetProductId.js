export const GetProductId = (productMappingData, productSubType) => {
  if (productSubType) {
    let product = productMappingData.find(
      (product) => product?.Name === productSubType
    );

    return product ? product?.Id : '';
  }
  return '';
};
