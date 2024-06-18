export const StringSchema = () => {
  return yup.object().shape({
    quesResp: yup
      .string()
      .test({
        name: question.quesTitle,
        message: `${question.quesTitle} is Required`,
        test: function (value) {
          const isRequired = question.isReqMobile;
          // console.log(`${question.quesTitle}`, question.quesResp);
          if (isRequired) {
            if (!question.quesResp) {
              return false;
            }
            return true;
          }
          return true;
        },
      })
      .nullable(),
  });
};
