// import { Button } from "@rneui/base";
import React from 'react';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { TextInput, Text } from 'react-native-paper';
import { horizontalScale, verticalScale } from '../../../utils/matrcis';
import { colors } from '../../colors';
import customTheme from '../../colors/theme';

export default function CustomDatepicker({
  control,
  validationProps,
  setValue,
  name,
  label,
  datepickerProps,
  isDisabled = false,
  required = false,
  isVisible = true,
  ...rest
}) {
  const [open, setOpen] = useState(false);
  if (!isVisible) {
    return null; // If isVisible is false, the component won't be rendered
  }
  const jsCoreDateCreator = (dateString) => {
    // dateString *HAS* to be in this format "YYYY-MM-DD HH:MM:SS"
    // console.log('date String', dateString, typeof dateString);
    if (typeof dateString !== 'string') {
      return dateString;
    } else {
      return new Date(dateString);
    }
    // else {
    //   return new Date(dateString);
    // }
    // console.log('Date Time Format', Intl.DateTimeFormat(dateString));
    // let dateParam = dateString.split(/[\s-:]/);
    // dateParam[1] = (parseInt(dateParam[1], 10) - 1).toString();
    // // console.log("Dates", dateParam, new Date(...dateParam), dateString);
    // return new Date(...dateParam);
  };
  const formatDate = (date) => {
    if (!date) return '';
    // console.log('Date-----', date, typeof date);
    let newdate;
    // if (typeof date === 'string') {
    newdate = jsCoreDateCreator(date);
    // console.log('New Date', newdate);
    // } else {
    //   newdate = new Date(date);
    // }
    // console.log('NewDate-----', newdate, typeof newdate);
    const day = newdate && newdate?.getDate().toString().padStart(2, '0');

    const month =
      newdate && (newdate?.getMonth() + 1).toString().padStart(2, '0');

    const year = newdate && newdate?.getFullYear();

    return `${day}-${month}-${year}`;
  };
  return (
    <View>
      <Controller
        control={control}
        // rules={validationProps}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => {
          return (
            <View style={styles.container}>
              <View style={styles.labelContainer}>
                <Text>
                  {required && <Text style={styles.asterisk}>* </Text>}
                  {label}
                </Text>
              </View>
              <TextInput
                // label={
                //   <Text>
                //     {required && <Text style={styles.asterisk}>*</Text>} {label}
                //   </Text>
                // }
                value={value ? formatDate(value) : ''}
                editable={false}
                disabled={isDisabled}
                error={error?.message}
                style={styles.textInput}
                placeholder="MM/DD/YYYY"
                right={
                  <TextInput.Icon
                    icon="calendar-month"
                    onPress={() => {
                      !isDisabled && setOpen(true);
                    }}
                  />
                }
                {...rest}
              />
              {error?.message && (
                <Text style={styles.errorMessage}>{error?.message}</Text>
              )}

              <DatePicker
                {...datepickerProps}
                modal
                date={value ? jsCoreDateCreator(value) : new Date()}
                open={open}
                onBlur={onBlur}
                onCancel={() => {
                  setOpen(false);
                }}
                onConfirm={(value) => {
                  // let formattedDate = format(value, 'dd/MM/yyyy');
                  onChange(value);
                  setOpen(false);
                }}
                mode="date"
                // locale="enGB"
                placeholder="select Date"
                format="DD-MM-YYYY"
                is24hourSource="device"
                // minDate="01-01-1916"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
              />
            </View>
          );
        }}
        name={name}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginHorizontal: horizontalScale(8),
    marginVertical: verticalScale(6),
    paddingBottom: 0,
  },
  label: {
    fontWeight: '400',
    fontSize: 15,
    marginHorizontal: 10,
    marginBottom: -15,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 2,
  },
  datePickerStyle: {
    width: horizontalScale(200),
    marginTop: verticalScale(20),
  },
  asterisk: {
    color: colors.asteriskRequired,
  },
  textInput: {
    backgroundColor: customTheme.colors.textInputBackground,
  },
  errorMessage: {
    color: customTheme.colors.error,
    marginTop: verticalScale(2),
  },
});
