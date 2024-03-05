import React, { useEffect, useState } from 'react';
import { StyleSheet, Modal, View } from 'react-native';
import {
  Button,
  Text,
  TextInput,
  Dialog,
  Divider,
  IconButton,
} from 'react-native-paper';
import { colors } from '../../colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { moderateScale, verticalScale } from '../../../utils/matrcis';
import customTheme from '../../colors/theme';
import CustomDatepicker from '../FormComponents/Datepicker';
import { FormControl, component } from '../FormComponents/FormControl';
import { useForm } from 'react-hook-form';
import Slider from '@react-native-community/slider';
import { yupResolver } from '@hookform/resolvers/yup';
import { createValidationSchema } from '../../../screens/LeadCapture/components/Handlers/validationSchema';
import * as yup from 'yup';
import { ScrollView } from 'react-native-gesture-handler';
const EMICalculatorComponent = ({
  visible,
  title,
  cancelBtnLabel,
  onDismiss,
}) => {
  const defaultValues = {
    Loan_Amount: '',
    Interest_Rate: '',
    Tenure: '',
    EMI: '',
  };
  const validationSchema = yup.object().shape({
    Loan_Amount: yup
      .string()
      .required('Loan Amount is required')
      .matches(/^([0-9]+)?$/, 'Invalid Value')
      .test('min', 'Amount should be in between 1 Lakh to 5 CR.', (value) => {
        if (!value) {
          return true;
        }
        return parseFloat(value.replace(',', '')) >= 100000;
      })
      .test('max', 'Amount should be in between 1 Lakh to 5 CR.', (value) => {
        if (!value) {
          return true;
        }
        return parseFloat(value.replace(',', '')) <= 50000000;
      })
      .nullable(),

    Interest_Rate: yup
      .string()
      .required('Interest Rate is required')
      .test('min', 'Interest Rate should be in between 1% to 25%.', (value) => {
        if (!value) {
          return true;
        }
        return parseFloat(value.replace(',', '')) >= 1;
      })
      .test('max', 'Interest Rate should be in between 1% to 25%.', (value) => {
        if (!value) {
          return true;
        }
        return parseFloat(value.replace(',', '')) <= 25;
      })
      .nullable(),

    Tenure: yup
      .string()
      .required('Tenure is required')
      .matches(/^([0-9]+)?$/, 'Invalid Value')
      .test('min', 'Tenure should be in between 12 to 360 Months.', (value) => {
        if (!value) {
          return true;
        }
        return parseFloat(value.replace(',', '')) >= 12;
      })
      .test('max', 'Tenure should be in between 12 to 360 Months.', (value) => {
        if (!value) {
          return true;
        }
        return parseFloat(value.replace(',', '')) <= 360;
      })
      .nullable(),
  });
  const {
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
    mode: 'all',
  });

  //   const [sliderValue, setSeliderValue] = useState("ab".repeat(LOWER_LIMIT / 2));

  const [loanAmount, setLoanAmount] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [loanTenure, setLoanTenure] = useState(0);
  const [emi, setEmi] = useState(0);
  const [isEMIVisible, setIsEMIVisible] = useState(false);

  const calculateEMI = (data) => {
    console.log('Calculate EMI function Called');
    console.log('Calculate EMI function Called', data);
    const principle = parseFloat(watch().Loan_Amount);
    const rate = parseFloat(watch().Interest_Rate) / 100 / 12;
    const months = parseFloat(watch().Tenure);

    if (principle > 0 && rate > 0 && months > 0) {
      const emiValue =
        (principle * rate * Math.pow(1 + rate, months)) /
        (Math.pow(1 + rate, months) - 1);
      console.log('EMI Calculated is', emiValue);
      setEmi(emiValue.toFixed(2));
      setValue('EMI', emiValue.toFixed(2));
      console.log(data);
      setIsEMIVisible(true);
    } else {
      setEmi(0);
      setValue('EMI', 0);
      setIsEMIVisible(false);
    }
  };
  return (
    <Dialog visible={visible} onDismiss={onDismiss}>
      <IconButton
        icon="close"
        iconColor={colors.gray300}
        size={25}
        onPress={() => {
          reset();
          setEmi(0);
          setIsEMIVisible(false);
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
        <Text>EMI Calculator</Text>
      </Dialog.Title>
      <Divider />
      <ScrollView style={{ height: '50%' }}>
        <Dialog.Content>
          <FormControl
            compType={component.sliderAndInput}
            label="Requested Loan Amount(₹)"
            name="Loan_Amount"
            control={control}
            setValue={setValue}
            required={true}
            placeholder="Enter Loan Amount"
            minValue="₹ 1L"
            maxValue="₹ 5CR"
            steps={5000}
            minimumSliderValue={100000}
            maximumSliderValue={50000000}
            type="decimal-pad"
          />
          <FormControl
            compType={component.sliderAndInput}
            label="Requested Monthly Tenure"
            name="Tenure"
            control={control}
            setValue={setValue}
            required={true}
            placeholder="Enter Tenure in months"
            minValue="12 Months"
            maxValue="360 Months"
            steps={10}
            minimumSliderValue={12}
            maximumSliderValue={360}
            type="decimal-pad"
          />
          <FormControl
            compType={component.sliderAndInput}
            label="Rate Of Interest"
            name="Interest_Rate"
            control={control}
            setValue={setValue}
            required={true}
            placeholder="Enter Rate of Interest"
            minValue="1%"
            maxValue="25%"
            steps={1}
            minimumSliderValue={1}
            maximumSliderValue={25}
            type="decimal-pad"
          />
        </Dialog.Content>
      </ScrollView>
      <Divider />

      {isEMIVisible ? (
        <View style={styles.emiValueWrapper}>
          <Text style={styles.emiValue}> EMI ₹ {emi}</Text>
        </View>
      ) : null}

      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={handleSubmit(calculateEMI)}>
          Calculate EMI
        </Button>
      </View>
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
    margin: verticalScale(20),
  },
  button: {
    borderRadius: 6,
    borderColor: colors.bgDark,
  },
  textInput: {
    backgroundColor: customTheme.colors.textInputBackground,
  },
  emiValueWrapper: {
    marginTop: verticalScale(10),
  },
  emiValue: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default EMICalculatorComponent;
