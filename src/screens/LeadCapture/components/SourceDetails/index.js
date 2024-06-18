import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { GetPicklistValues } from '../../../../common/functions/getPicklistValues';
import Accordion from '../../../../common/components/AccordionComponent/Accordion';
import {
  FormControl,
  component,
} from '../../../../common/components/FormComponents/FormControl';

const LeadSourceDetails = ({
  leadMetadata,
  control,
  setValue,
  watch,
  dsaBrJn,
  customerMasterData,
  teamHeirarchyMasterData,
  collapsedError,
  pincodeMasterData,
  isFormEditable,
  dsaBrJnMasterData,
  teamHeirarchyByUserId,
}) => {
  const [leadSourcePicklist, setLeadSourcePicklist] = useState([]);
  const [channelNamePicklist, setChannelNamePicklist] = useState([]);
  const [customerNamePicklist, setCustomerNamePicklist] = useState([]);
  const [branchNamePicklist, setBranchNamePicklist] = useState([]);
  const [empCodePicklist, setEmpCodePicklist] = useState([]);

  // console.log('teamHeirarchyMasterData', teamHeirarchyMasterData);
  useEffect(() => {
    const picklist = GetPicklistValues(leadMetadata, 'LeadSource')?.filter(
      (value) => value.label !== 'Digital'
    );
    setLeadSourcePicklist(picklist);
  }, [leadMetadata]);
  // console.log('Dsa Br Jn Data', dsaBrJn, teamHeirarchyByUserId);
  const GetChannelName = (dsaBrJn, leadSource) => {
    let channelNames = [];
    if (leadSource === 'DSA') {
      dsaBrJnMasterData.map((value) => {
        if (
          value.Account__r?.RecordType.Name === leadSource &&
          teamHeirarchyByUserId &&
          teamHeirarchyByUserId?.EmpBrch__r?.Name === value?.BanchBrch__r.Name
        ) {
          channelNames.push({
            label: value?.Account__r?.Name,
            value: value?.Account__r?.Name,
          });
        }
      });
    }
    if (leadSource === 'UGA') {
      dsaBrJn?.map((value) => {
        if (value.Account__r?.RecordType.Name === leadSource) {
          channelNames.push({
            label: value?.Account__r?.Name,
            value: value?.Account__r?.Name,
          });
        }
      });
    }

    return channelNames;
  };

  const GetCustomerIdPicklist =(customerMasterData,leadSource)=>{
    let customerNames = [];
    if (leadSource === `Customer Referral`) {
      customerMasterData?.map((value) => {
        customerNames.push({
          label: value?.Name,
          value: value?.Name,
        });
      });
      return customerNames;
    }
    return customerNames
  }

  const GetBranchPicklist = (pincodeMasterData) => {
    const branchSet = new Set();

    pincodeMasterData?.forEach((branch) => {
      const branchName = branch?.Bank_Branch__r?.Name;
      if (branchName) {
        branchSet.add(branchName);
      }
    });

    const uniqueBranchNames = Array.from(branchSet).map((branchName) => ({
      label: branchName,
      value: branchName,
    }));

    return uniqueBranchNames;
  };
  const GetEmployeeCodePicklist = (
    teamHeirarchyMasterData,
    pincodeMasterData,
    selectedBranch
  ) => {
    let employeeCodePicklist = [];
    const branchDetails =
      selectedBranch &&
      pincodeMasterData?.find(
        (branch) => branch?.Bank_Branch__r?.Name === selectedBranch
      );

    branchDetails &&
      teamHeirarchyMasterData?.map((th) => {
        if (th.BranchCode__c === branchDetails?.Bank_Branch__r?.BrchCode__c) {
          th?.Employee_Code__c &&
            employeeCodePicklist.push({
              label: th?.Employee_Code__c,
              value: th?.Employee_Code__c,
            });
        }
      });

    return employeeCodePicklist;
  };

  useEffect(() => {
    const empCodes = GetEmployeeCodePicklist(
      teamHeirarchyMasterData,
      pincodeMasterData,
      watch().Branch_Name__c
    );
    // console.log('empCode Picklist', empCodes, teamHeirarchyMasterData);
    setEmpCodePicklist(empCodes);
  }, [teamHeirarchyMasterData, pincodeMasterData, watch()?.Branch_Name__c]);

  useEffect(() => {
    const branchPicklist = GetBranchPicklist(pincodeMasterData);
    // console.log('branchName Picklist--', branchPicklist);
    setBranchNamePicklist(branchPicklist);
  }, [pincodeMasterData]);

  useEffect(() => {
    let channelPicklist = GetChannelName(
      dsaBrJn,
      watch()?.LeadSource
    );
    // console.log('Channel Picklist', channelPicklist.length);
    setChannelNamePicklist(channelPicklist);
  }, [dsaBrJn, watch()?.LeadSource]);

  useEffect(() => {
    if (watch().LeadSource === 'Customer Referral') {
      let customerName = customerMasterData?.find(
        (value) => value.Name === watch().Cust_ID
      );
      let cusNamePicklist = GetCustomerIdPicklist(customerMasterData,watch().LeadSource)
      setCustomerNamePicklist(cusNamePicklist)
      if (customerName) {
        setValue('Customer_Name__c', customerName?.Customer_Name__c);
      }
    }
  }, [watch().LeadSource, customerMasterData, watch().Cust_ID]);

  useEffect(() => {
    if (watch().LeadSource === 'DSA' || watch().LeadSource === 'UGA') {
      let dsaUgaCode = dsaBrJn?.find(
        (value) => value?.Account__r?.Name === watch().Channel_Name
      );
      if (dsaUgaCode) {
        setValue('DSA_Code__c', dsaUgaCode?.DSA_UGA_Code__c);
      }
    }
  }, [watch().LeadSource, dsaBrJn, watch().Channel_Name]);

  return (
    <Accordion
      title={'Lead Source Details'}
      Id={'LeadSourceDetails'}
      collapsedError={collapsedError}
      initialState={true}
    >
      <FormControl
        compType={component.dropdown}
        label="Lead Source"
        name="LeadSource"
        control={control}
        setValue={setValue}
        required={true}
        options={leadSourcePicklist}
        isDisabled={!isFormEditable}
      />

      <FormControl
        compType={component.searchDropdown}
        label={'Channel Name'}
        name="Channel_Name"
        control={control}
        setValue={setValue}
        required={true}
        options={channelNamePicklist}
        isVisible={
          watch().LeadSource === 'DSA' ||
          watch().LeadSource === 'UGA' 
            ? true
            : false
        }
        isDisabled={!isFormEditable}
      />
       <FormControl
        compType={component.searchDropdown}
        label={'Customer ID' }
        name="Cust_ID"
        control={control}
        setValue={setValue}
        required={true}
        options={customerNamePicklist}
        isVisible={
          watch().LeadSource === 'Customer Referral'
            ? true
            : false
        }
        isDisabled={!isFormEditable}
      />
      <FormControl
        compType={component.readOnly}
        label="DSA/UGA Code"
        name="DSA_Code__c"
        control={control}
        setValue={setValue}
        required={false}
        isVisible={false}
        isDisabled={!isFormEditable}
      />
      <FormControl
        compType={component.searchDropdown}
        label="Branch Name"
        name="Branch_Name__c"
        control={control}
        setValue={setValue}
        required={true}
        options={branchNamePicklist}
        isVisible={watch().LeadSource === 'UNICO Employee' ? true : false}
        isDisabled={!isFormEditable}
      />
      <FormControl
        compType={component.searchDropdown}
        label="Employee Code"
        name="Employee_Code__c"
        control={control}
        setValue={setValue}
        required={true}
        options={empCodePicklist}
        isVisible={watch().LeadSource === 'UNICO Employee' ? true : false}
        isDisabled={!isFormEditable}
      />
      <FormControl
        compType={component.readOnly}
        label="RM Name"
        name="RM_SM_Name"
        control={control}
        setValue={setValue}
        required={false}
        isVisible={watch().LeadSource === 'Direct-RM' ? true : false}
        isDisabled={!isFormEditable}
      />
      <FormControl
        compType={component.readOnly}
        label="Customer Name"
        name="Customer_Name__c"
        control={control}
        setValue={setValue}
        required={false}
        isVisible={watch().LeadSource === 'Customer Referral' ? true : false}
        isDisabled={!isFormEditable}
      />
    </Accordion>
  );
};

export default LeadSourceDetails;
