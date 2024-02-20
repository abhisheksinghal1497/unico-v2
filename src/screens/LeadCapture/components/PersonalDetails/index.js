import React, { useEffect, useState } from 'react';
import {
  FormControl,
  component,
} from '../../../../common/components/FormComponents/FormControl';
import { GetPicklistValues } from '../../../../common/functions/getPicklistValues';
import Accordion from '../../../../common/components/AccordionComponent/Accordion';
import { useRole } from '../../../../store/context/RoleProvider';
import { globalConstants } from '../../../../common/constants/globalConstants';
import { GetBrManagerId } from '../Handlers/GetBranchManagerId';

const LeadPersonalDetails = ({
  control,
  setValue,
  leadMetadata,
  collapsedError,
  pincodeMasterData,
  teamHeirarchyMasterData,
  dsaBrJnData,
  teamHeirarchyByUserId,
  watch,
}) => {
  const [customerProfilePicklist, setCustomerProfilePicklist] = useState([]);
  const [pincodePicklist, setPincodePicklist] = useState([]);
  console.log('Pincode Master', pincodeMasterData);
  const role = useRole();

  const GetPincodePicklist = (role, leadSource) => {
    try {
      let pincodePicklist = [];
      if (role === globalConstants.RoleNames.RM) {
        if (
          leadSource === 'UNICO Employee' ||
          leadSource === 'Customer Referral'
        ) {
          pincodeMasterData.map((pin) => {
            pincodePicklist.push({
              label: pin?.PinCode__r?.PIN__c,
              value: pin?.PinCode__r?.PIN__c,
            });
          });
        }
      }
    } catch (error) {
      console.log('Error GetPincodePicklist', error);
    }
  };

  useEffect(() => {
    const picklist = GetPicklistValues(leadMetadata, 'Customer_Profile__c');
    setCustomerProfilePicklist(picklist);
  }, [leadMetadata]);

  useEffect(() => {
    if (
      watch().LeadSource === 'Direct-RM' &&
      role === globalConstants.RoleNames.RM
    ) {
      setValue('Br_Manager_Br_Name', teamHeirarchyByUserId?.EmpBrch__r.Name);
    } else {
      !watch().Branch_Manager__c && setValue('Br_Manager_Br_Name', '');
    }
  }, [watch().LeadSource]);

  return (
    <Accordion
      title={'Personal Details'}
      Id={'PersonalDetails'}
      collapsedError={collapsedError}
      initialState={false}
    >
      <FormControl
        compType={component.dropdown}
        label="Customer Profile"
        name="Customer_Profile__c"
        control={control}
        setValue={setValue}
        required={false}
        options={customerProfilePicklist}
        // isDisabled={!editable}
      />
      <FormControl
        compType={component.input}
        label="First Name"
        name="FirstName"
        control={control}
        setValue={setValue}
        required={true}
        // isDisabled={!editable}
      />
      <FormControl
        compType={component.input}
        label="Middle Name"
        name="MiddleName"
        control={control}
        setValue={setValue}
        required={false}
        // isDisabled={!editable}
      />
      <FormControl
        compType={component.input}
        label="Last Name"
        name="LastName"
        control={control}
        setValue={setValue}
        required={true}
        // isDisabled={!editable}
      />
      <FormControl
        compType={component.numberPad}
        label="Mobile Number"
        name="MobilePhone"
        control={control}
        setValue={setValue}
        required={true}
        // isDisabled={!editable}
      />
      <FormControl
        compType={component.numberPad}
        label="Alternate Mobile Number"
        name="Alternative_Mobile_Number__c"
        control={control}
        setValue={setValue}
        required={false}
        // isDisabled={!editable}
      />
      <FormControl
        compType={component.email}
        label="Email ID"
        name="Email"
        control={control}
        setValue={setValue}
        required={false}
        // isDisabled={!editable}
      />
      <FormControl
        compType={component.textArea}
        label="Residential Address"
        name="Residential_Address__c"
        control={control}
        setValue={setValue}
        required={false}
        // isDisabled={!editable}
      />
      <FormControl
        compType={component.numberPad}
        label="Pincode"
        name="Pincode__c"
        control={control}
        setValue={setValue}
        required={true}
        // isDisabled={!editable}
      />

      <FormControl
        compType={component.readOnly}
        label="Branch Name"
        name="Br_Manager_Br_Name"
        control={control}
        setValue={setValue}
        required={false}
        isVisible={
          watch().LeadSource === 'Direct-RM' &&
          role === globalConstants.RoleNames.RM
            ? true
            : false
        }
        // isDisabled={!editable}
      />
    </Accordion>
  );
};

export default LeadPersonalDetails;
