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
import { useEffect } from 'react';
import {
  getBankBranchMaster,
  getCustomerMaster,
  getDsaBrJn,
  getLocationBrJnMaster,
  getPincodeMaster,
  getProductMapping,
} from '../../store/redux/actions/masterData';
import { getLeadMetadata } from '../../store/redux/actions/leadMetadata';
import { useForm } from 'react-hook-form';
import customTheme from '../../common/colors/theme';
import Stepper from '../../common/components/StepperComponent/Stepper';
import LeadActivities from '../../common/components/MandatoyToggle';
import { ScrollView } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
import { getThMaster } from '../../store/redux/actions/teamHeirarchy';
import { useRole } from '../../store/context/RoleProvider';
import { globalConstants } from '../../common/constants/globalConstants';
import Toast from 'react-native-toast-message';
import CustomAlert from '../../common/components/BottomPopover/CustomAlert';
import { createValidationSchema } from '../LeadCapture/components/Handlers/validationSchema';
import { QueryObject } from '../../services/QueryObject';
import { query } from '../../common/constants/Queries';
import { GetBrManagerBrName } from '../LeadCapture/components/Handlers/GetBranchManagerId';
import { GetProductSubTypeName } from '../LeadCapture/components/Handlers/GetProductId';
import LeadSourceDetails from '../LeadCapture/components/SourceDetails';
import LeadPersonalDetails from '../LeadCapture/components/PersonalDetails';
import LeadAdditionalDetails from '../LeadCapture/components/AdditionalDetails';
import { addLeadStyle } from '../LeadCapture/styles/AddLeadStyle';
import { useRoute } from '@react-navigation/native';
import {
  GetBrNameByBrId,
  GetRmSmName,
} from '../LeadCapture/components/Handlers/GetChannelId';
import MobileOtpConsent from '../LeadCapture/components/OtpVerification/components/MobileOtpConsent';
import LeadConverted from '../LeadCapture/components/LeadConverted/LeadConverted';
import { OnSubmitLead } from '../LeadCapture/components/Handlers/onSubmit';
import { screens } from '../../common/constants/screen';
import BackgroundTimer from 'react-native-background-timer';
import EMICalculatorComponent from '../../common/components/Modal/EMICalculatorComponent';
import ScheduleMeetComponent from '../../common/components/Modal/ScheduleMeetComponent';
import { oauth } from 'react-native-force';
import { ConvertLead } from '../LeadCapture/components/Handlers/ConvertLead';
import StatusCard from '../LeadList/component/statusCard';
import { verticalScale } from '../../utils/matrcis';
export default function EditLeadScreen({ navigation }) {
  const route = useRoute();
  let leadId = route.params.Id;
  const isOnline = useInternet();
  const empRole = useRole();
  const { hideBottomTab, setHideBottomTab } = useContext(BottomTabContext);
  const [conversionResponse, setConversionResponse] = useState({});
  const [hasErrors, setHasErrors] = React.useState(false);
  const [postData, setPostData] = useState({});
  const [id, setId] = useState(leadId);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isFormEditable, setFormEditable] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [isMobileNumberChanged, setIsMobileNumberChanged] = useState(false);
  const [retryCounts, setRetryCounts] = useState(0);
  const [expectedOtp, setExpectedOtp] = useState(null);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(globalConstants.otpTimer);
  const [coolingPeriodTimer, setCoolingPeriodTimer] = useState(null);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [emiModalVisible, setEmiModalVisible] = useState(false);
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
  const { customerMasterData } = useSelector(
    (state) => state.masterData.customerMaster
  );

  const { pincodeMasterData } = useSelector(
    (state) => state.masterData.pincodeMaster
  );

  const getLeadData = async () => {
    try {
      setAddLoading(true);
      let leadData = {};
      if (isOnline) {
        let leadById = await QueryObject(query.getLeadByIdQuery(id));
        leadData =
          leadById?.records?.length > 0 ? { ...leadById?.records[0] } : {};
        // console.log('isOnline', leadData, id);
      } else {
        let offlineLead = await QuerySoupById(
          soupConfig.lead.soupName,
          soupConfig.lead.queryPath,
          id,
          soupConfig.lead.pageSize
        );
        leadData = offlineLead?.length > 0 ? { ...offlineLead[0] } : {};
      }

      setPostData(leadData);
      setAddLoading(false);
    } catch (error) {
      setAddLoading(false);
      Toast.show({
        type: 'error',
        text1: JSON.stringify(error),
        position: 'top',
      });
      // navigation.goback();
      console.log('Error getLeadData', error);
    }
  };
  useEffect(() => {
    getLeadData();
  }, [id]);
  //   console.log('Post Data', postData);
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

  useEffect(() => {
    dispatch(getProductMapping());
    dispatch(getLeadMetadata());
    dispatch(getDsaBrJn());
    dispatch(getCustomerMaster());
    dispatch(getThMaster());
    dispatch(getPincodeMaster());
    setHideBottomTab(true);
  }, []);

  const defaultValues = {};
  const checkOwner = (postData) => {
    oauth.getAuthCredentials((cred) => {
      if (id && id.length > 0) {
        if (postData?.Status === 'Closed Lead') {
          setFormEditable(false);
          return;
        }
        // console.log('Entered', id, postData?.OwnerId, cred?.userId);
        if (postData?.OwnerId === cred?.userId) {
          //   console.log('Entered 2 ', cred);
          setFormEditable(true);
          return;
        }

        setFormEditable(false);
        return;
      }
      setFormEditable(false);
      return;
    });
  };

  useEffect(() => {
    checkOwner(postData);
  }, [id, postData]);

  useEffect(() => {
    if (Object.keys(postData).length > 0) {
      let data = { ...postData };

      let getChannelNameByIdOrName = () => {
        return data?.Channel_Name__c && data?.Channel_Name__c.length > 0
          ? dsaBrJnData?.find(
              (value) =>
                value.Account__r.Name === data.Channel_Name__c ||
                value.Account__c === data.Channel_Name__c
            )?.Account__r.Name
          : '';
      };
      data.Channel_Name = getChannelNameByIdOrName();
      data.MobilePhoneOtp = data.MobilePhone;
      data.RM_SM_Name = GetRmSmName(
        teamHeirarchyMasterData,
        data.RM_SM_Name__c
      );
      data.Br_Manager_Br_Name = GetBrNameByBrId(
        pincodeMasterData,
        data.Bank_Branch__c
      );
      // console.log('Data Br_Manager_Br_Name', data.Br_Manager_Br_Name);
      data.ProductLookup = GetProductSubTypeName(
        productMappingData,
        data.ProductLookup__c
      );

      reset({ ...data });
    }
  }, [postData, teamHeirarchyByUserId, teamHeirarchyMasterData, dsaBrJnData]);
  const validationSchema = createValidationSchema(empRole);
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
    setHasErrors(Object.keys(errors).length > 0);
  }, [errors]);

  const handleConvertButton = () => {
    navigation.navigate(screens.leadList);
  };
  //------ Handlers------//
  const handlePrevSubmit = () => {
    setCurrentPosition((prev) => prev - 1);
  };

  //   console.log('Watch', watch());

  const onSubmit = async (data) => {
    try {
      setAddLoading(true);

      //   console.log('Onsubmit', data);
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
      //   setCurrentPosition((prev) => prev + 1);
      setAddLoading(false);
    } catch (error) {
      //   setAddLoading(false);

      //   Toast.show({
      //     type: 'error',
      //     text1: 'Failed to create lead',
      //     position: 'top',
      //   });
      console.log('Error in handleSubmit: ', error);
    }
  };
  const toggleSchedule = () => {
    setScheduleModalVisible(!scheduleModalVisible);
  };
  const toggleEmiCalculator = () => {
    setEmiModalVisible(!emiModalVisible);
  };
  //   console.log('Watch Values', watch());
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
      {isFormEditable && currentPosition !== 2 && (
        <LeadActivities
          id={id}
          mobileNumber={watch().MobilePhone}
          leadStatus={watch().Status}
          onScheduleClicked={toggleSchedule}
          onEmiCalculatorClicked={toggleEmiCalculator}
        />
      )}
      {currentPosition !== 2 && (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginRight: verticalScale(20),
            marginTop: verticalScale(20),
          }}
        >
          <StatusCard status={watch()?.Status} />
        </View>
      )}
      {currentPosition === 0 && (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          enabled
          keyboardVerticalOffset={Platform.select({
            ios: 125,
            android: 500,
          })}
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
            <View>
              <Button
                mode="outlined"
                style={addLeadStyle.cancelButton}
                onPress={handlePrevSubmit}
              >
                Previous
              </Button>
            </View>
            <View>
              <Button
                mode={'contained'}
                style={addLeadStyle.cancelButton}
                onPress={handleSubmit(convertToLAN)}
                contentStyle={{ flexDirection: 'row-reverse' }}
                disabled={addLoading || !watch().OTP_Verified__c}
              >
                Submit
              </Button>
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
        setAddLoading={setAddLoading}
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
}
