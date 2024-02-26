export const globalConstants = {
  fileSize: 10,
  pdJsonType: 'PersonalDiscussion',
  dynamicFormDataTypes: {
    text: 'Text',
    number: 'Number',
    picklist: 'Picklist',
    radio: 'Radio',
    textarea: 'Textarea',
    file: 'File',
    reference: 'Reference',
    table: 'Table',
    date: 'Date',
    video: 'Video',
    picklistMultiselect: 'Picklist Multiselect',
    phone: 'Phone',
    dateTime: 'DateTime',
    decimal: 'Decimal',
    currency: 'Currency',
  },
  debounceTime: 10,
  otpTimer: 120,
  otpRetries:3,
  RoleNames: {
    RM: 'RM',
    DSA: 'DSA',
    UGA: 'UGA',
    BrManager: 'BBH',
  },
};

export const ROLES = {
  LEAD_CAPTURE: ['RM', 'DSA', 'UGA'],
  WEBVIEW: ['RM'],
  // PD_LIST: ['UW', 'ACM', 'RCM', 'NCM', 'CH', 'ZCM', 'CPA'],
};

export const firebaseConfig = {
  apiKey: 'AIzaSyAH9BBOJgAnuiewnFlt-7uqloIeATeP1Ww',
  projectId: 'fedfina-sales-pro',
  storageBucket: 'fedfina-sales-pro.appspot.com',
  messagingSenderId: '512281335360',
  appId: '1:512281335360:android:88b537ea72a469d4c5b1a5',
};
