import {
  View,
  Text,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useContext, useState } from 'react';
import { useInternet } from '../../store/context/Internet';
import { BottomTabContext } from '../../navigation/mainNavigation';
import { useDispatch, useSelector } from 'react-redux';
import BackgroundTimer from 'react-native-background-timer';
import { useEffect } from 'react';
import {
  getBankBranchMaster,
  getCustomerMaster,
  getDsaBrJn,
  getDsaBrJnMaster,
  getLocationBrJnMaster,
  getPincodeMaster,
  getProductMapping,
} from '../../store/redux/actions/masterData';
import { getLeadMetadata } from '../../store/redux/actions/leadMetadata';
import { useForm } from 'react-hook-form';
import customTheme from '../../common/colors/theme';
import { addLeadStyle } from './styles/AddLeadStyle';
import Stepper from '../../common/components/StepperComponent/Stepper';
import LeadActivities from '../../common/components/MandatoyToggle';
import LeadSourceDetails from './components/SourceDetails';
import LeadPersonalDetails from './components/PersonalDetails';
import { ScrollView } from 'react-native-gesture-handler';
import LeadAdditionalDetails from './components/AdditionalDetails';
import { Button } from 'react-native-paper';
import { getThMaster } from '../../store/redux/actions/teamHeirarchy';
import { OnSubmitLead } from './components/Handlers/onSubmit';
import { useRole } from '../../store/context/RoleProvider';
import { globalConstants } from '../../common/constants/globalConstants';
import { createValidationSchema } from './components/Handlers/validationSchema';
import Toast from 'react-native-toast-message';
import { GetDefaultValues } from './components/Handlers/GetDefaultValues';
import MobileOtpConsent from './components/OtpVerification/components/MobileOtpConsent';
import LeadConverted from './components/LeadConverted/LeadConverted';
import ScheduleMeetComponent from '../../common/components/Modal/ScheduleMeetComponent';
import EMICalculatorComponent from '../../common/components/Modal/EMICalculatorComponent';
import { oauth } from 'react-native-force';
import { ConvertLead } from './components/Handlers/ConvertLead';
import { screens } from '../../common/constants/screen';

const AddLead = ({ navigation }) => {
  // --------Define Variables Here----------//

  const isOnline = useInternet();
  const empRole = useRole();
  const { hideBottomTab, setHideBottomTab } = useContext(BottomTabContext);
  const [hasErrors, setHasErrors] = React.useState(false);
  const [postData, setPostData] = useState({});
  const [id, setId] = useState('');
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isFormEditable, setFormEditable] = useState(true);
  const [conversionResponse, setConversionResponse] = useState({});
  const [addLoading, setAddLoading] = useState(false);
  const [isMobileNumberChanged, setIsMobileNumberChanged] = useState(false);
  const [retryCounts, setRetryCounts] = useState(0);
  const [expectedOtp, setExpectedOtp] = useState(null);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [emiModalVisible, setEmiModalVisible] = useState(false);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(globalConstants.otpTimer);
  const [coolingPeriodTimer, setCoolingPeriodTimer] = useState(null);
  const maxRetries = globalConstants.otpRetries;
  const steps = ['Basic details', 'OTP Verification'];
  const dispatch = useDispatch();
  //Fetch Data from store//
  const { leadMetadata } = useSelector((state) => state.leadMetadata);
  const { teamHeirarchyByUserId } = useSelector(
    (state) => state.teamHeirarchy.teamHeirarchyById
  );

  const { teamHeirarchyMasterData } = useSelector(
    (state) => state.teamHeirarchy.teamHeirarchyMaster
  );

  const { productMappingData } = useSelector(
    (state) => state.masterData.productMapping
  );

  const { dsaBrJnData } = useSelector((state) => state.masterData.dsaBrJn);
  const { dsaBrJnMasterData } = useSelector(
    (state) => state.masterData.dsaBrJnMaster
  );
  const { customerMasterData } = useSelector(
    (state) => state.masterData.customerMaster
  );

  const { pincodeMasterData } = useSelector(
    (state) => state.masterData.pincodeMaster
  );
  // console.log('Pin Code Master Data', pincodeMasterData);
  // console.log('productMappingData Data', productMappingData);
  // console.log('leadMetadata Data', leadMetadata);
  // console.log('teamHeirarchyMasterData ', teamHeirarchyMasterData);
  const checkOwner = (postData) => {
    oauth.getAuthCredentials((cred) => {
      if (id && id.length > 0) {
        if (postData?.Status === 'Closed Lead') {
          setFormEditable(false);
          return;
        }
        if (postData?.OwnerId === cred?.userId) {
          setFormEditable(true);
          return;
        }

        setFormEditable(false);
        return;
      }
      setFormEditable(true);
      return;
    });
  };

  useEffect(() => {
    checkOwner(postData);
  }, [id, postData]);

  useEffect(() => {
    dispatch(getProductMapping());
    dispatch(getLeadMetadata());
    dispatch(getDsaBrJn());
    dispatch(getDsaBrJnMaster());
    dispatch(getCustomerMaster());
    dispatch(getThMaster());
    dispatch(getPincodeMaster());
    setHideBottomTab(true);
  }, []);

  //------------Default Values ---------------
  const defaultValues = GetDefaultValues(
    teamHeirarchyByUserId,
    dsaBrJnData,
    empRole
  );
  const validationSchema = createValidationSchema(empRole, currentPosition);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
    mode: 'all',
  });

  useEffect(() => {
    reset(initialLeadData);
  }, [postData, watch]);
  // ---------------------------------------------
  const initialLeadData =
    Object.keys(postData).length > 0 ? postData : defaultValues;

  useEffect(() => {
    setHasErrors(Object.keys(errors).length > 0);
  }, [errors]);

  const decrementTimer = () => {
    if (timer > 0) {
      setTimer(timer - 1);
    }
    if (coolingPeriodTimer && coolingPeriodTimer > 0) {
      setCoolingPeriodTimer(coolingPeriodTimer - 1);
    }
  };
  useEffect(() => {
    const interval = BackgroundTimer.setInterval(decrementTimer, 1000);
    return () => BackgroundTimer.clearInterval(interval);
  }, [timer, coolingPeriodTimer]);

  // --------------Handlers-------------//

  //------ Submit Handler ------//
  const onSubmit = async (data) => {
    try {
      setAddLoading(true);
      // Toast.show({
      //   type: 'success',
      //   text1: 'Lead created successfully',
      //   position: 'top',
      // });

      await OnSubmitLead(
        data,
        setId,
        id,
        teamHeirarchyByUserId,
        dsaBrJnData,
        empRole,
        isOnline,
        setPostData,
        setCurrentPosition,
        currentPosition,
        teamHeirarchyMasterData,
        productMappingData,
        pincodeMasterData,
        setIsMobileNumberChanged
      );
      // setCurrentPosition((prev) => prev + 1);
      setAddLoading(false);
      // setIsPincodeConfirmed(false);
    } catch (error) {
      setAddLoading(false);
      Toast.show({
        type: 'error',
        text1: 'Failed to create lead',
        position: 'top',
      });
      console.log('Error in handleSubmit: ', error);
    }
  };
  const handleConvertButton = () => {
    navigation.navigate(screens.leadList);
  };

  //------Step Handlers------//
  const handlePrevSubmit = () => {
    setCurrentPosition((prev) => prev - 1);
  };

  const convertToLAN = async (data) => {
    try {
      setAddLoading(true);
      const res = await ConvertLead(data);
      //   console.log('Res Lead Convert', res);
      setConversionResponse(res);
      setCurrentPosition((prev) => prev + 1);
      setAddLoading(false);
    } catch (error) {
      setAddLoading(false);
      console.log('Convert to LAN', error);
    }
  };

  // console.log('Lead MetaData', leadMetadata);

  //-----Schedule Meeting Button------//

  const toggleSchedule = () => {
    setScheduleModalVisible(!scheduleModalVisible);
  };
  const toggleEmiCalculator = () => {
    setEmiModalVisible(!emiModalVisible);
  };

  return (
    <View style={addLeadStyle.container}>
      {addLoading && (
        <View style={addLeadStyle.loaderView}>
          <ActivityIndicator size="large" color={customTheme.colors.primary} />
        </View>
      )}

      {globalConstants.RoleNames.RM === empRole && (
        <Stepper
          steps={steps}
          totalSteps={2}
          currentPosition={currentPosition}
        />
      )}
      {globalConstants.RoleNames.RM === empRole &&
        isFormEditable &&
        currentPosition !== 2 && (
          <LeadActivities
            id={id}
            mobileNumber={watch().MobilePhone}
            onScheduleClicked={toggleSchedule}
            leadStatus={watch().Status}
            onEmiCalculatorClicked={toggleEmiCalculator}
          />
        )}

      {currentPosition === 0 && (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          enabled
          keyboardVerticalOffset={Platform.select({ ios: 125, android: 500 })}
        >
          <ScrollView>
            {globalConstants.RoleNames.RM === empRole && (
              <LeadSourceDetails
                leadMetadata={leadMetadata}
                dsaBrJn={dsaBrJnData}
                customerMasterData={customerMasterData}
                teamHeirarchyMasterData={teamHeirarchyMasterData}
                control={control}
                setValue={setValue}
                watch={watch}
                collapsedError={hasErrors}
                pincodeMasterData={pincodeMasterData}
                isFormEditable={isFormEditable}
              />
            )}
            <LeadPersonalDetails
              leadMetadata={leadMetadata}
              control={control}
              setValue={setValue}
              collapsedError={hasErrors}
              pincodeMasterData={pincodeMasterData}
              dsaBrJnMasterData={dsaBrJnMasterData}
              teamHeirarchyMasterData={teamHeirarchyMasterData}
              teamHeirarchyByUserId={teamHeirarchyByUserId}
              dsaBrJn={dsaBrJnData}
              watch={watch}
              isFormEditable={isFormEditable}
            />
            <LeadAdditionalDetails
              leadMetadata={leadMetadata}
              control={control}
              setValue={setValue}
              teamHeirarchyByUserId={teamHeirarchyByUserId}
              productMapping={productMappingData}
              watch={watch}
              collapsedError={hasErrors}
              isFormEditable={isFormEditable}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      )}
      {currentPosition === 1 && (
        <MobileOtpConsent
          LeadId={id}
          // leadMetadata={leadMetadata}
          setRetryCounts={setRetryCounts}
          retryCounts={retryCounts}
          maxRetries={maxRetries}
          expectedOtp={expectedOtp}
          setExpectedOtp={setExpectedOtp}
          control={control}
          handleSubmit={handleSubmit}
          watch={watch}
          setValue={setValue}
          otp={otp}
          setOtp={setOtp}
          setAddLoading={setAddLoading}
          timer={timer}
          setTimer={setTimer}
          setPostData={setPostData}
          postData={postData}
          isMobileNumberChanged={isMobileNumberChanged}
          setIsMobileNumberChanged={setIsMobileNumberChanged}
          coolingPeriodTimer={coolingPeriodTimer}
          setCoolingPeriodTimer={setCoolingPeriodTimer}
        />
      )}
      {currentPosition === 2 && (
        <LeadConverted
          handleConvertButton={handleConvertButton}
          LeadCaptureData={conversionResponse}
        />
      )}
      <View style={addLeadStyle.buttonContainer}>
        {currentPosition === 0 && (
          <Button
            mode={!isFormEditable ? 'contained' : 'outlined'}
            style={addLeadStyle.cancelButton}
            disabled={!isFormEditable}
            onPress={handleSubmit(onSubmit)}
            icon="play"
            contentStyle={{ flexDirection: 'row-reverse' }}
          >
            {globalConstants.RoleNames.RM === empRole ? 'Next' : 'Save'}
          </Button>
        )}
        {currentPosition === 1 && (
          <>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
              }}
            >
              <View>
                <Button
                  mode="outlined"
                  style={{ borderColor: customTheme.colors.primary }}
                  onPress={handlePrevSubmit}
                >
                  Previous
                </Button>
              </View>
              <View>
                <Button
                  mode={'contained'}
                  onPress={handleSubmit(convertToLAN)}
                  disabled={addLoading || !watch().OTP_Verified__c}
                >
                  Submit
                </Button>
              </View>
            </View>
          </>
        )}
      </View>
      <ScheduleMeetComponent
        control={control}
        onDismiss={() => {
          setScheduleModalVisible(!scheduleModalVisible);
        }}
        setValue={setValue}
        cancelBtnLabel={'Close'}
        visible={scheduleModalVisible}
      />
      <EMICalculatorComponent
        control={control}
        cancelBtnLabel={'Close'}
        visible={emiModalVisible}
        onDismiss={() => {
          setEmiModalVisible(!emiModalVisible);
        }}
      />
    </View>
  );
};

export default AddLead;
