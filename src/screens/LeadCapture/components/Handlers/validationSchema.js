import * as yup from 'yup';

// --------------------------Required Regex for validations Schema-------------------
const onlyAlphanumericRegex = /^[a-zA-Z0-9 ]+$/;
const onlyAlphabeticRegex = /^[a-zA-Z]*$/;
const onlyAlphabeticWithSpaceRegex = /^[a-zA-Z ]*$/;
const emailRegex = /^([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})?$/;
const pincodeRegex = /^[1-9]{1}[0-9]{2}[0-9]{3}$/;
const onlyNumbers = /^[0-9]*$/;

// const isPincodeServiceable = (pincode)=>{

// }

export const createValidationSchema = (pincodeMasterData) => {
  return yup.object().shape({
    //   //-----------------Lead Source Details Validations----------//
    LeadSource: yup.string().required('Lead Source is required').nullable(),

    Channel_Name__c: yup
      .string()
      .test({
        name: 'conditional',
        message: 'Channel Name is required for Connector/DSA Lead Source',
        test: function (value) {
          const isSource =
            this.parent.LeadSource === 'Connector' ||
            this.parent.LeadSource === 'DSA' ||
            this.parent.LeadSource === ' Customer Referral';
          if (isSource) {
            return !!value; // Channel Name is required for Connector/DSA Lead Source
          }
          return true; // Validation passes if not a Connector/DSA Lead Source
        },
      })
      .nullable(),
    Branch_Name__c: yup
      .string()
      .test({
        name: 'conditional',
        message: 'Branch Name is required for UNICO Employee Lead Source',
        test: function (value) {
          const isSource = this.parent.LeadSource === 'UNICO Employee';
          if (isSource) {
            return !!value; // Branch Name is required for UNICO Employee Lead Source
          }
          return true; // Validation passes if not a Connector/DSA Lead Source
        },
      })
      .nullable(),
    Employee_Code__c: yup
      .string()
      .test({
        name: 'conditional',
        message: 'Employee Code is required for UNICO Employee Lead Source',
        test: function (value) {
          const isSource = this.parent.LeadSource === 'UNICO Employee';
          if (isSource) {
            return !!value; // Branch Name is required for UNICO Employee Lead Source
          }
          return true; // Validation passes if not a Connector/DSA Lead Source
        },
      })
      .nullable(),

    //   //--------------- Personal Details Validations-----------//

    MobilePhone: yup
      .string()
      .required('Phone number is required')
      .matches(/^[6-9]\d{9}$/, 'Please enter a valid Mobile Number')
      .nullable(),
    Alternative_Mobile_Number__c: yup
      .string()
      .nullable()
      .matches(/^([6-9]\d{9})?$/, 'Please enter a valid Mobile Number'),
    // Email: yup.string().nullable().email("Invalid email address"),

    Email: yup
      .string()
      .matches(emailRegex, 'Please enter a valid Email ID')
      .nullable(),
    FirstName: yup
      .string()
      .required('First Name is required')
      .matches(onlyAlphabeticRegex, 'Please enter a valid First Name')
      .nullable(),
    MiddleName: yup
      .string()
      .matches(onlyAlphabeticRegex, 'Please enter a valid Middle Name')
      .nullable(),
    LastName: yup
      .string()
      .required('Last Name is required')
      .matches(onlyAlphabeticRegex, 'Please enter a valid Last Name')
      .nullable(),
    // Pincode__c: yup
    //   .string()
    //   .required('Pincode is required')
    //   .matches(pincodeRegex, 'Please enter a valid Pincode')
    //   .nullable(),
    Pincode__c: yup
      .string()
      .required('Pincode is required')
      .test({
        name: 'conditional',
        message: 'Invalid Pincode',
        test: function (value) {
          const { createError } = this;
          // if (!value) {
          //   return true;
          // }
          if (!pincodeRegex.test(value)) {
            return createError({ message: 'Please enter a valid Pincode' });
          }
          // let isServiceable = isPincodeServiceable(pincodeMasterData,value);
          if (!pincodeRegex.test(value)) {
            return createError({ message: 'This Pincode is not Serviceable' });
          }
          return true;
        },
      })
      .nullable(),

    //   //-------------------------Loan Validation scheme ------------------------//
    Product__c: yup.string().required('Product is required').nullable(),

    Requested_loan_amount__c: yup
      .string()
      .matches(/^([0-9]+)?$/, 'Invalid Value')
      .test('min', 'Amount should be in between 1 Lakh to 2 CR.', (value) => {
        if (!value) {
          return true;
        }
        return parseFloat(value.replace(',', '')) >= 100000;
      })
      .test('max', 'Amount should be in between 1 Lakh to 2 CR.', (value) => {
        if (!value) {
          return true;
        }
        return parseFloat(value.replace(',', '')) <= 20000000;
      })
      .nullable(),
    Requested_tenure_in_Months__c: yup
      .string()
      .matches(/^([0-9]+)?$/, 'Invalid Value')
      .test('min', 'Tenure should be in between 12 to 360', (value) => {
        if (!value) {
          return true;
        }
        return parseFloat(value.replace(',', '')) >= 12;
      })
      .test('max', 'Tenure should be in between 12 to 360', (value) => {
        if (!value) {
          return true;
        }
        return parseFloat(value.replace(',', '')) <= 360;
      })
      .nullable(),

    //Mobile Otp Consent Validations

    // Otp__c: yup
    //   .string()
    //   .test({
    //     name: 'conditional',
    //     message: 'OTP is required',
    //     test: function (value) {
    //       const isRequired =
    //         this.parent.ConsentType__c === 'OTP Consent' && expectedOtp;
    //       if (isRequired) {
    //         if (!value) {
    //           return false;
    //         }
    //         return true;
    //       }
    //       return true; // Validation passes
    //     },
    //   })
    //   .nullable(),
  });
};
