import React from 'react';
import Accordion from '../../../../common/components/AccordionComponent/Accordion';
import {
  FormControl,
  component,
} from '../../../../common/components/FormComponents/FormControl';
import { useState } from 'react';
import { useEffect } from 'react';
import { GetPicklistValues } from '../../../../common/functions/getPicklistValues';
import { getProductType } from '../../../../common/functions/getProductType';
import { useRole } from '../../../../store/context/RoleProvider';
import { globalConstants } from '../../../../common/constants/globalConstants';

const LeadAdditionalDetails = ({
  control,
  setValue,
  leadMetadata,
  teamHeirarchyByUserId,
  productMapping,
  watch,
  collapsedError,
}) => {
  const [product, setProduct] = useState([]);
  const [productSubType, setProductSubType] = useState([]);
  const [propertyIdentified, setPropertyIdentified] = useState([]);
  const role = useRole();

  const getProductSubType = (productMapping, selectedPT) => {
    // console.log('Product Sub Type', productMapping, selectedPT, watch());
    let subType = [];
    productMapping?.map((item) => {
      if (item?.Family === selectedPT) {
        subType.push({
          label: item?.Name,
          value: item?.Name,
        });
      }
    });
    return subType;
  };

  useEffect(() => {
    const propertyIdentifiedList = GetPicklistValues(
      leadMetadata,
      'Property_Identified__c'
    );
    setPropertyIdentified(propertyIdentifiedList);
    const productPickList = getProductType(productMapping);
    setProduct(productPickList);
    const productSubTypePicklist = getProductSubType(
      productMapping,
      watch().Product__c
    );
    setProductSubType(productSubTypePicklist);
  }, [leadMetadata, productMapping, watch().Product__c, teamHeirarchyByUserId]);
  const productTypeList = Object.keys(product).map((key) => ({
    label: product[key],
    value: product[key],
  }));
  return (
    <Accordion
      title={'Additional Details'}
      Id={'AdditionalDetails'}
      collapsedError={collapsedError}
      initialState={false}
    >
      <FormControl
        compType={component.dropdown}
        label="Product"
        name="Product__c"
        control={control}
        required={true}
        options={productTypeList}
        setValue={setValue}
        // isDisabled={!editable}
      />
      <FormControl
        compType={component.dropdown}
        label="Product Sub Type"
        name="ProductLookup"
        control={control}
        required={false}
        options={productSubType}
        setValue={setValue}
        // isDisabled={!editable}
      />
      <FormControl
        compType={component.numberPad}
        label="Requested Loan Amount"
        name="Requested_loan_amount__c"
        control={control}
        required={false}
        isVisible={role === globalConstants.RoleNames.RM ? true : false}
        // isDisabled={!editable}
      />
      <FormControl
        compType={component.numberPad}
        label="Requested Tenure in Months"
        name="Requested_tenure_in_Months__c"
        control={control}
        required={false}
        isVisible={role === globalConstants.RoleNames.RM ? true : false}
        // isDisabled={!editable}
      />
      <FormControl
        compType={component.dropdown}
        label="Property Identified"
        name="Property_Identified__c"
        control={control}
        required={false}
        options={propertyIdentified}
        setValue={setValue}
        isVisible={role === globalConstants.RoleNames.RM ? true : false}
        // isDisabled={!editable}
      />
    </Accordion>
  );
};

export default LeadAdditionalDetails;
