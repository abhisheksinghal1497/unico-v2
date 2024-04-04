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
  otpRetries: 3,
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
  SCHEDULE_Meeting: ['RM'],
  // PD_LIST: ['UW', 'ACM', 'RCM', 'NCM', 'CH', 'ZCM', 'CPA'],
};


