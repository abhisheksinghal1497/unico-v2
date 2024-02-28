import React, { useEffect, useState } from 'react';
import { StyleSheet, Modal, View } from 'react-native';
import {
  Button,
  Text,
  TextInput,
  Dialog,
  IconButton,
} from 'react-native-paper';
import { colors } from '../../colors';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import { moderateScale, verticalScale } from '../../../utils/matrcis';
import customTheme from '../../colors/theme';
// import CustomDatepicker from '../FormComponents/Datepicker';
import { FormControl, component } from '../FormComponents/FormControl';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const ScheduleMeetComponent = ({
  visible,
  title,
  cancelBtnLabel,
  onDismiss,
  onSave,
}) => {
  const validationSchema = yup.object().shape({
    StartDateTime: yup
      .string()
      .required('Start Date and Time Is Required')
      .nullable(),
  });

  const defaultValues = {
    Subject: 'Meeting',
    StartDateTime: '',
    EndDateTime: '',
    Description: '',
    ReminderDateTime: '',
    IsReminderSet: true,
  };

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
    mode: 'all',
  });
  const onSubmit = (data) => {
    onDismiss();
    reset();
    console.log('onSubmit Function Changed', data);
    console.log('Watch Function Changed', watch());
    setValue('ScheduleDate', '');
    let schDate = watch().ScheduleDate;
    console.log('After Reset schDate', schDate);
  };

  const remindDateTimePicklist = [
    { label: '30 Minutes', value: '30 Minutes' },
    { label: '15 Minutes', value: '15 Minutes' },
    { label: '1 Hour', value: '1 Hour' },
    { label: '2 Hour', value: '2 Hour' },
  ];

  return (
    <Dialog visible={visible} onDismiss={onDismiss}>
      <IconButton
        icon="close"
        iconColor={colors.gray300}
        size={25}
        onPress={() => {
          reset();
          onDismiss();
        }}
        style={{
          position: 'absolute',
          right: -20,
          top: -40,
          borderColor: colors.gray300,
          borderWidth: 2,
          backgroundColor: 'white',
        }}
      />
      <Dialog.Title>
        <Text>Schedule Meeting</Text>
      </Dialog.Title>
      <Dialog.ScrollArea>
        <FormControl
          compType={component.readOnly}
          control={control}
          watch={watch}
          required={true}
          label="Subject"
          name="Subject"
          // setValue={setValue}
        />
        <FormControl
          control={control}
          watch={watch}
          required={true}
          compType={component.customdatetime}
          label="Start Date and Time"
          name="StartDateTime"
          mode="datetime"
          // setValue={setValue}
        />
        <FormControl
          control={control}
          watch={watch}
          required={true}
          compType={component.customdatetime}
          label="End Date and Time"
          name="EndDateTime"
          mode="datetime"
          // setValue={setValue}
        />
        <FormControl
          compType={component.textArea}
          label="Description"
          name="Description"
          control={control}
          watch={watch}
          setValue={setValue}
          required={false}
          // isDisabled={!editable}
        />
        <FormControl
          compType={component.dropdown}
          control={control}
          watch={watch}
          required={true}
          label="Remind Time Before Event"
          name="ReminderDateTime"
          options={remindDateTimePicklist}
          setValue={setValue}
        />
      </Dialog.ScrollArea>
      <Dialog.Actions>
        <Button mode="contained" onPress={handleSubmit(onSubmit)}>
          Confirm
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderRadius: 10,
    padding: moderateScale(25),
    width: '80%',
    backgroundColor: colors.bgLight,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 2,
  },
  alertIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: verticalScale(10),
  },
  title: {
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: verticalScale(20),
  },
  button: {
    borderRadius: 6,
    borderColor: colors.bgDark,
  },
  textInput: {
    backgroundColor: customTheme.colors.textInputBackground,
  },
});

export default ScheduleMeetComponent;
