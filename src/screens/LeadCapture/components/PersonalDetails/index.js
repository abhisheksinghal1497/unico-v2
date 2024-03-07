import React, { useEffect, useState } from "react";
import {
  FormControl,
  component,
} from "../../../../common/components/FormComponents/FormControl";
import { GetPicklistValues } from "../../../../common/functions/getPicklistValues";
import Accordion from "../../../../common/components/AccordionComponent/Accordion";
import { useRole } from "../../../../store/context/RoleProvider";
import { globalConstants } from "../../../../common/constants/globalConstants";

const LeadPersonalDetails = ({
  control,
  setValue,
  leadMetadata,
  collapsedError,
  pincodeMasterData,
  teamHeirarchyMasterData,
  dsaBrJn,
  teamHeirarchyByUserId,
  watch,
  resetField,
}) => {
  const [customerProfilePicklist, setCustomerProfilePicklist] = useState([]);
  const [pincodePicklist, setPincodePicklist] = useState([]);
  const [brNamePicklist, setBrNamePicklist] = useState([]);
  // console.log("Pincode Master", pincodeMasterData);
  const role = useRole();

  const GetPincodePicklist = (leadSource, branchName, channelName) => {
    try {
      let pincodePicklist = [];
      // if (role === globalConstants.RoleNames.RM) {
      if (
        leadSource === "UNICO Employee" ||
        leadSource === "Customer Referral"
        // ||
        // leadSource === 'DSA' ||
        // leadSource === 'UGA'
      ) {
        pincodeMasterData.map((pin) => {
          pincodePicklist.push({
            label: pin?.PinCode__r?.PIN__c,
            value: pin?.PinCode__r?.PIN__c,
          });
        });
      }
      if (leadSource === "Direct-RM" && branchName) {
        pincodeMasterData.map((pin) => {
          if (pin?.Bank_Branch__r?.Name === branchName) {
            pincodePicklist.push({
              label: pin?.PinCode__r?.PIN__c,
              value: pin?.PinCode__r?.PIN__c,
            });
          }
        });
      }
      if ((leadSource === "DSA" || leadSource === "UGA") && channelName) {
        let branch = dsaBrJn.find((dbr) => dbr.Account__r.Name === channelName);
        console.log("Entered", channelName, branch, pincodeMasterData);
        pincodeMasterData.map((pin) => {
          if (branch?.BanchBrch__r.Name === pin?.Bank_Branch__r?.Name) {
            pincodePicklist.push({
              label: pin?.PinCode__r?.PIN__c,
              value: pin?.PinCode__r?.PIN__c,
            });
          }
        });
      }
      // }
      return pincodePicklist;
    } catch (error) {
      console.log("Error GetPincodePicklist", error);
    }
  };

  const GetBrNamePicklist = (pincode, pincodeMasterData, leadSource) => {
    let brNPicklist = [];
    if (
      leadSource === "UNICO Employee" ||
      leadSource === "Customer Referral" ||
      leadSource === "DSA" ||
      leadSource === "UGA"
    ) {
      pincodeMasterData.map((pin) => {
        if (pincode === pin.PinCode__r?.PIN__c)
          brNPicklist.push({
            label: pin?.Bank_Branch__r?.Name,
            value: pin?.Bank_Branch__r?.Name,
          });
      });
    }

    return brNPicklist;
  };

  useEffect(() => {
    resetField("MiddleName");
  }, [watch().Customer_Profile__c]);

  useEffect(() => {
    const pinPicklist = GetPincodePicklist(
      watch().LeadSource,
      teamHeirarchyByUserId?.EmpBrch__r.Name,
      watch().Channel_Name
    );
    setPincodePicklist(pinPicklist);
  }, [
    watch().LeadSource,
    teamHeirarchyByUserId?.EmpBrch__r.Name,
    watch().Channel_Name,
  ]);
  useEffect(() => {
    const brPicklist = GetBrNamePicklist(
      watch().Pincode__c,
      pincodeMasterData,
      watch().LeadSource
    );
    setBrNamePicklist(brPicklist);
  }, [watch().Pincode__c, pincodeMasterData, watch().LeadSource]);

  useEffect(() => {
    const picklist = GetPicklistValues(leadMetadata, "Customer_Profile__c");
    setCustomerProfilePicklist(picklist);
  }, [leadMetadata]);

  useEffect(() => {
    if (
      watch().LeadSource === "Direct-RM" &&
      role === globalConstants.RoleNames.RM
    ) {
      setValue("Br_Manager_Br_Name", teamHeirarchyByUserId?.EmpBrch__r.Name);
    }
  }, [watch().LeadSource]);

  return (
    <Accordion
      title={"Personal Details"}
      Id={"PersonalDetails"}
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
        isVisible={watch().Customer_Profile__c == "Salaried" ? true : false}
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
        compType={component.smartSearch}
        label="Pincode"
        name="Pincode__c"
        control={control}
        setValue={setValue}
        required={true}
        watch={watch}
        options={pincodePicklist}
        // isDisabled={!editable}
      />
      <FormControl
        compType={component.searchDropdown}
        label="Branch Name"
        name="Br_Manager_Br_Name"
        control={control}
        setValue={setValue}
        required={true}
        options={brNamePicklist}
        isVisible={
          watch().LeadSource !== "Direct-RM" &&
          role === globalConstants.RoleNames.RM
            ? true
            : false
        }
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
          watch().LeadSource === "Direct-RM" &&
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
