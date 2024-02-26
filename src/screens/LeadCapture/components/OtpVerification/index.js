import React, { useState, useEffect } from "react";

import {
  FormControl,
  component,
} from "../../../common/components/FormComponents/FormControl";

import MobileOtpConsent from "./components/MobileOtpConsent";
import PhysicalConsent from "./components/PhysicalConsent";
import { GetPicklistValues } from "../../../common/functions/getPicklistValues";
import Loading from "../../Lead/component/Loading";
import { ScrollView } from "react-native";
import { addLeadStyle } from "../styles/AddLeadStyle";

const OTPVerification = ({
  LeadId,
  leadMetadata,
  docDetails,
  setDocDetails,
  retryCounts,
  maxRetries,
  setRetryCounts,
  expectedOtp,
  setExpectedOtp,
  addLoading,
  control,
  handleSubmit,
  watch,
  setValue,
  otp,
  setOtp,
  mobilePhoneCount,
  setMobilePhoneCount,
  openFloatingButton,
  setAddLoading,
}) => {
  const [consentTypePicklist, SetConsentTypePicklist] = useState(null);
  const [physicalConsentReason, setPhysicalConsentReason] = useState(null);

  // console.log('Watch', watch());

  // ---------------------Extracting picklist Values from Meta Data----------------

  useEffect(() => {
    if (!consentTypePicklist) {
      const consentTypeValues = GetPicklistValues(
        leadMetadata,

        "ConsentType__c"
      );

      SetConsentTypePicklist(consentTypeValues);
    }

    if (!physicalConsentReason) {
      const physicalConsentReasonValues = GetPicklistValues(
        leadMetadata,
        "RationaleUsingPhyConsent__c"
      );
      setPhysicalConsentReason(physicalConsentReasonValues);
    }
  }, [consentTypePicklist, physicalConsentReason, leadMetadata]);
  useEffect(() => {
    let getDetails = retryCounts.find(
      (value) => value.MobilePhone === watch().MobilePhone
    );
    setMobilePhoneCount(getDetails);
  }, [retryCounts, watch().MobilePhone]);

  const selectedConsentType = watch().ConsentType__c;

  useEffect(() => {
    if (selectedConsentType === "OTP Consent") {
      setValue("RationaleUsingPhyConsent__c", "");
      setValue("Comments__c", "");
    }
  }, [selectedConsentType]);

  return (
    <>
      <ScrollView style={[openFloatingButton && addLeadStyle.overlay]}>
        {consentTypePicklist === null ? (
          <Loading isLoading={true} />
        ) : (
          <FormControl
            compType={component.radio}
            name="ConsentType__c"
            control={control}
            defaultValue={watch().ConsentType__c}
            options={consentTypePicklist}
            isDisabled={mobilePhoneCount && mobilePhoneCount?.isVerified}
          />
        )}

        {selectedConsentType === "OTP Consent" ? (
          <MobileOtpConsent
            control={control}
            watch={watch}
            LeadId={LeadId}
            setValue={setValue}
            retryCounts={retryCounts}
            setRetryCounts={setRetryCounts}
            maxRetries={maxRetries}
            handleSubmit={handleSubmit}
            expectedOtp={expectedOtp}
            setExpectedOtp={setExpectedOtp}
            otp={otp}
            setOtp={setOtp}
            mobilePhoneCount={mobilePhoneCount}
            setAddLoading={setAddLoading}
          />
        ) : (
          <PhysicalConsent
            control={control}
            watch={watch}
            physicalConsentReason={physicalConsentReason}
            setValue={setValue}
            docDetails={docDetails}
            setDocDetails={setDocDetails}
            id={LeadId}
            setAddLoading={setAddLoading}
          />
        )}
      </ScrollView>
    </>
  );
};

export default OTPVerification;
