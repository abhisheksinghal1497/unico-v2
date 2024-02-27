import React from "react";
import CheckBox from "./Checkbox";
import CustomInput from "./CustomInput";
import CustomDatepicker from "./Datepicker";
import CustomDropdown from "./Dropdown";
import InputRadio from "./InputRadio";
import CustomMaskedInput from "./MaskedInput";
import CustomMultiSelect from "./MultiSelect";
import ReadOnly from "./ReadOnly";
import SearchCustomDropdown from "./SearchDropdown";
import SmartSearchDropdown from "./SmartSearchDropdown";
import OtpInput from "./OtpInput";
import CustomTextArea from "./CustomTextArea";
// import UploadPhotographs from "../../../screens/PdCapture/components/UploadPhotographs";
import MultiSelectDropdown from "./MultiSelect";
import CustomDateTimePicker from "./CustomDateTimePicker";
import SliderAndInputComponent from "./SliderAndInputComponent";
// import UploadVideo from "../../../screens/PdCapture/components/UploadVideo";
// import CustomDateSelctor from '../DynamicFormComponents/components/DateSelector';
// import DynamicDropdownComponent from '../DynamicFormComponents/components/DynamicDropdownComponent';

export const component = {
  readOnly: "readOnly",
  maskInput: "maskInput",
  input: "input",
  otpInput: "otpInput",
  textArea: "textArea",
  number: "number",
  photograph: "photograph",
  video: "video",
  dropdown: "dropdown",
  dynamicDropdown: "dynamicDropdown",
  searchDropdown: "searchDropdown",
  smartSearch: "smartSearch",
  multiselect: "multiselect",
  checkbox: "checkbox",
  datetime: "datetime",
  customdatetime: "dateandtime",
  // customDateSelctor: 'customDateSelctor',
  radio: "radio",
  url: "url",
  email: "email",
  phonePad: "phonePad",
  numberPad: "numberPad",
  asciCapable: "asciCapable",
  numbersANDpunctuation: "numbers-and-punctuation",
  namePhonePad: "name-phone-pad",
  decimalPad: "decimal-pad",
  twitter: "twitter",
  webSearch: "web-search",
  asciiCapableNumberPad: "ascii-capable-number-pad",
  visiblePassword: "visible-password",
  sliderAndInput: "sliderAndInput",
};

export const FormControl = ({ compType, options, ...rest }) => {
  switch (compType) {
    case component.readOnly:
      return <ReadOnly {...rest} />;
    case component.input:
      return <CustomInput {...rest} />;
    case component.otpInput:
      return <OtpInput {...rest} />;
    case component.textArea:
      return <CustomTextArea {...rest} />;
    case component.sliderAndInput:
      return <SliderAndInputComponent {...rest} />;
    case component.maskInput:
      return <CustomMaskedInput {...rest} />;
    case component.number:
      return <CustomInput {...rest} />;
    case component.searchDropdown:
      return <SearchCustomDropdown {...rest} options={options} />;
    // case component.dynamicDropdown:
    //   return <DynamicDropdownComponent {...rest} options={options} />;
    case component.smartSearch:
      return <SmartSearchDropdown {...rest} options={options} />;
    // case component.photograph:
    //   return <UploadPhotographs {...rest} />;
    // case component.video:
    //   return <UploadVideo {...rest} />;
    case component.dropdown:
      return <CustomDropdown {...rest} options={options} />;
    case component.multiselect:
      return <MultiSelectDropdown {...rest} options={options} />;
    case component.checkbox:
      return <CheckBox {...rest} />;
    case component.datetime:
      return <CustomDatepicker {...rest} />;
    // case component.customDateSelctor:
    //   return <CustomDateSelctor {...rest} />;
    case component.customdatetime:
      return <CustomDateTimePicker {...rest} />;
    case component.url:
      return <CustomInput {...rest} type="url" />;
    case component.email:
      return <CustomInput {...rest} type="email-address" />;
    case component.phonePad:
      return <CustomInput {...rest} type="phone-pad" />;
    case component.numberPad:
      return <CustomInput {...rest} type="number-pad" />;
    case component.asciCapable:
      return <CustomInput {...rest} type="ascii-capable" />;
    case component.numbersANDpunctuation:
      return <CustomInput {...rest} type="numbers-and-punctuation" />;
    case component.namePhonePad:
      return <CustomInput {...rest} type="name-phone-pad" />;
    case component.decimalPad:
      return <CustomInput {...rest} type="decimal-pad" />;
    case component.twitter:
      return <CustomInput {...rest} type="twitter" />;
    case component.webSearch:
      return <CustomInput {...rest} type="web-search" />;
    case component.asciiCapableNumberPad:
      return <CustomInput {...rest} type="ascii-capable-number-pad" />;
    case component.visiblePassword:
      return <CustomInput {...rest} type="visible-password" />;
    case component.radio:
      return <InputRadio {...rest} options={options} />;
  }
};
