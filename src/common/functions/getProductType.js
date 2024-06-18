export const getProductType = (productMappingData) => {
  try {
    if (productMappingData && productMappingData?.length > 0) {
      const productTypes = [
        ...new Set(productMappingData.map((product) => product.Family)),
      ];

      return productTypes;
      // return {
      //   productType: productTypes,
      //   hasError: true,
      // };
    } else {
      return [];
    }
  } catch (error) {
    console.log('Error in get Product Type Function');
    return [];
  }
};
