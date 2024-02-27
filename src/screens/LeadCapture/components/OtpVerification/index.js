import React, { useState, useEffect } from 'react';

import MobileOtpConsent from './components/MobileOtpConsent';

import { ScrollView } from 'react-native';
import { addLeadStyle } from '../styles/AddLeadStyle';

const OTPVerification = ({
  LeadId,
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
  setAddLoading,
  postData,
  setPostData,
}) => {
  return (
    <>
      <ScrollView>
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
          setAddLoading={setAddLoading}
          postData={postData}
          setPostData={setPostData}
          addLoading={addLoading}
        />
      </ScrollView>
    </>
  );
};

export default OTPVerification;
