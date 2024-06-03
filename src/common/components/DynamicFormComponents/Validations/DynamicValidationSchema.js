import * as yup from "yup";
import { globalConstants } from "../../../constants/globalConstants";
import { convertToObject } from "typescript";

export const createValidationSchemaFromJson = (formData) => {
  // console.log('Validation form Data------->', formData);
  let node = yup.object().shape({
    PD: yup.array().of(
      yup.object().shape({
        questions: yup.array().of(yup.lazy(() => node.default(undefined))),
      })
    ),
  });

  const getpdQuestionsValidationSchema = yup.lazy((question) => {
    const getQuesConfigValidationSchema = yup.lazy((data, i) => {
      let dataObject = {};

      question?.quesConfig?.columns.forEach((column) => {
        let fieldValidation = yup.string();
        // Add required validation for Text type
        if (column?.type === globalConstants.dynamicFormDataTypes.text) {
          fieldValidation = fieldValidation
            .test({
              name: column?.fieldName,
              message: `${column?.label} is Required`,
              test: function (value) {
                // -------------------------------------------------
                let isDependent = false;
                //console.log("This parent", this.parent);
                if (question?.criteriaList) {
                  question?.criteriaList?.map((item) => {
                    // console.log("item", item);
                    let parentQuestion = {};
                    item?.criVal &&
                      formData?.map((section) => {
                        section?.questions?.map((ques) => {
                          if (ques?.quesId === item?.evalQues) {
                            parentQuestion = ques;
                          }
                        });
                      });

                    if (
                      parentQuestion &&
                      Object.keys(parentQuestion).length > 0
                    ) {
                      if (
                        item?.criVal &&
                        item?.criVal?.includes(parentQuestion?.quesResp)
                      ) {
                        isDependent = true;
                      } else {
                        isDependent = false;
                      }
                    }
                  });
                } else {
                  isDependent = true;
                }
                const isRequired = column?.isReqMobile && isDependent;
                // ---------------------------------------------------
                // const isRequired = column?.isReqMobile;
                if (isRequired) {
                  if (!value) {
                    return false;
                  }
                }
                return true;
              },
            })
            .test({
              name: column?.fieldName,
              test: function (value) {
                const pattern = JSON.parse(
                  column?.mobileValidationConfig
                )?.pattern;
                if (value !== null && value !== undefined) {
                  if (!value.toString().match(pattern)) {
                    return this.createError({
                      message: "Only Alphabetic characters are allowed",
                    });
                  }
                  //return true;
                }
                return true;
              },
            });
        }
        if (column?.type === globalConstants.dynamicFormDataTypes.email) {   
          fieldValidation = fieldValidation.test({
            name: column?.fieldName,
            message: `${column?.label} is Required`,
            test: function (value) {
              // -------------------------------------------------
              let isDependent = false;
              //console.log("This parent", this.parent);
              if (question?.criteriaList) {
                question?.criteriaList?.map((item) => {
                  // console.log("item", item);
                  let parentQuestion = {};
                  item?.criVal &&
                    formData?.map((section) => {
                      section?.questions?.map((ques) => {
                        if (ques?.quesId === item?.evalQues) {
                          parentQuestion = ques;
                        }
                      });
                    });

                  if (
                    parentQuestion &&
                    Object.keys(parentQuestion).length > 0
                  ) {
                    if (
                      item?.criVal &&
                      item?.criVal?.includes(parentQuestion?.quesResp)
                    ) {
                      isDependent = true;
                    } else {
                      isDependent = false;
                    }
                  }
                });
              } else {
                isDependent = true;
              }
              const isRequired = column?.isReqMobile && isDependent;
              // ---------------------------------------------------
              // const isRequired = column?.isReqMobile;
              if (isRequired) {
                if (!value) {
                  return false;
                }
              }
              return true;
            },
          }) .test({
            name: column?.fieldName,
            test: function (value) {
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
              if (value !== null && value !== undefined) {
                if (!value.toString().match(emailRegex)) {
                  return this.createError({
                    message: "Invalid value format",
                  });
                }
                //return true;
              }
              return true;
            },
          });
        }
        // Add required validation for Phone type
        if (column?.type === globalConstants.dynamicFormDataTypes.phone) {
          fieldValidation = fieldValidation.test({
            name: column?.fieldName,
            message: `${column?.label} is Required`,
            test: function (value) {
              // ---------------------------------------
              let isDependent = false;
              //console.log("This parent", this.parent);
              if (question?.criteriaList) {
                question?.criteriaList?.map((item) => {
                  // console.log("item", item);
                  let parentQuestion = {};
                  item?.criVal &&
                    formData?.map((section) => {
                      section?.questions?.map((ques) => {
                        if (ques?.quesId === item?.evalQues) {
                          parentQuestion = ques;
                        }
                      });
                    });

                  if (
                    parentQuestion &&
                    Object.keys(parentQuestion).length > 0
                  ) {
                    if (
                      item?.criVal &&
                      item?.criVal?.includes(parentQuestion?.quesResp)
                    ) {
                      isDependent = true;
                    } else {
                      isDependent = false;
                    }
                  }
                });
              } else {
                isDependent = true;
              }
              const isRequired = column?.isReqMobile && isDependent;
              // ----------------------------------
              if (isRequired) {
                if (!value) {
                  return false;
                }
              }
              return true;
            },
          });

          // Add custom validation for Phone type
          if (column?.mobileValidationConfig) {
            // console.log("entered----->");
            const pattern = JSON.parse(column?.mobileValidationConfig)?.pattern;
            if (pattern) {
              fieldValidation = fieldValidation.test({
                name: column?.fieldName,
                message: "Invalid phone number",
                test: function (value) {
                  if (!value || value.trim().length === 0) {
                    return true;
                  }
                  return new RegExp(pattern).test(value);
                },
              });
            }
          }
        }

        if (column?.type === globalConstants.dynamicFormDataTypes.number) {
          fieldValidation = fieldValidation
            .test({
              name: column?.fieldName,
              message: `${column?.label} is Required`,
              test: function (value) {
                // ---------------------------------------
                let isDependent = false;
                //console.log("This parent", this.parent);
                if (question?.criteriaList) {
                  question?.criteriaList?.map((item) => {
                    // console.log("item", item);
                    let parentQuestion = {};
                    item?.criVal &&
                      formData?.map((section) => {
                        section?.questions?.map((ques) => {
                          if (ques?.quesId === item?.evalQues) {
                            parentQuestion = ques;
                          }
                        });
                      });

                    if (
                      parentQuestion &&
                      Object.keys(parentQuestion).length > 0
                    ) {
                      if (
                        item?.criVal &&
                        item?.criVal?.includes(parentQuestion?.quesResp)
                      ) {
                        isDependent = true;
                      } else {
                        isDependent = false;
                      }
                    }
                  });
                } else {
                  isDependent = true;
                }
                const isRequired = column?.isReqMobile && isDependent;
                // ------------------------------------------
                // const isRequired = column?.isReqMobile;
                if (isRequired) {
                  if (!value) {
                    return false;
                  }
                }
                return true;
              },
            })
            .test({
              name: column?.fieldName,
              test: function (value) {
                // console.log("value", value);
                const pattern = /^[0-9.]+$/;
                if (value !== null && value !== undefined) {
                  if (value && value < 0) {
                    return this.createError({
                      message: "Negative values are not allowed",
                    });
                  }

                  if (!value.toString().match(pattern)) {
                    return this.createError({
                      message: "Invalid value format",
                    });
                  }
                  //return true;
                }
                return true;
              },
            });
        }

        if (column?.type === globalConstants.dynamicFormDataTypes.currency) {
          fieldValidation = fieldValidation.test({
            name: column?.fieldName,
            message: `${column?.label} is Required`,
            test: function (value) {
              // ---------------------------------------
              let isDependent = false;
              //console.log("This parent", this.parent);
              if (question?.criteriaList) {
                question?.criteriaList?.map((item) => {
                  // console.log("item", item);
                  let parentQuestion = {};
                  item?.criVal &&
                    formData?.map((section) => {
                      section?.questions?.map((ques) => {
                        if (ques?.quesId === item?.evalQues) {
                          parentQuestion = ques;
                        }
                      });
                    });

                  if (
                    parentQuestion &&
                    Object.keys(parentQuestion).length > 0
                  ) {
                    if (
                      item?.criVal &&
                      item?.criVal?.includes(parentQuestion?.quesResp)
                    ) {
                      isDependent = true;
                    } else {
                      isDependent = false;
                    }
                  }
                });
              } else {
                isDependent = true;
              }
              const isRequired = column?.isReqMobile && isDependent;
              // ------------------------------------------
              // const isRequired = column?.isReqMobile;
              if (isRequired) {
                if (!value) {
                  return false;
                }
              }
              return true;
            },
          });
        }
        if (column?.type === globalConstants.dynamicFormDataTypes.textarea) {
          fieldValidation = fieldValidation.test({
            name: column?.fieldName,
            message: `${column?.label} is Required`,
            test: function (value) {
              // const isRequired = column?.isReqMobile;
              // -----------------------Dependent Logic-----------------
              let isDependent = false;
              //console.log("This parent", this.parent);
              if (question?.criteriaList) {
                question?.criteriaList?.map((item) => {
                  // console.log("item", item);
                  let parentQuestion = {};
                  item?.criVal &&
                    formData?.map((section) => {
                      section?.questions?.map((ques) => {
                        if (ques?.quesId === item?.evalQues) {
                          parentQuestion = ques;
                        }
                      });
                    });

                  if (
                    parentQuestion &&
                    Object.keys(parentQuestion).length > 0
                  ) {
                    if (
                      item?.criVal &&
                      item?.criVal?.includes(parentQuestion?.quesResp)
                    ) {
                      isDependent = true;
                    } else {
                      isDependent = false;
                    }
                  }
                });
              } else {
                isDependent = true;
              }
              const isRequired = column?.isReqMobile && isDependent;
              // ----------------------------------------------------
              if (isRequired) {
                if (!value) {
                  return false;
                }
              }
              return true;
            },
          });
        }

        if (column?.type === globalConstants.dynamicFormDataTypes.picklist) {
          fieldValidation = fieldValidation.test({
            name: column?.fieldName,
            message: `${column?.label} is Required`,
            test: function (value) {
              // ------------------------------Dependent Logic-----------------------
              let isDependent = false;
              //console.log("This parent", this.parent);
              if (question?.criteriaList) {
                question?.criteriaList?.map((item) => {
                  // console.log("item", item);
                  let parentQuestion = {};
                  item?.criVal &&
                    formData?.map((section) => {
                      section?.questions?.map((ques) => {
                        if (ques?.quesId === item?.evalQues) {
                          parentQuestion = ques;
                        }
                      });
                    });

                  if (
                    parentQuestion &&
                    Object.keys(parentQuestion).length > 0
                  ) {
                    if (
                      item?.criVal &&
                      item?.criVal?.includes(parentQuestion?.quesResp)
                    ) {
                      isDependent = true;
                    } else {
                      isDependent = false;
                    }
                  }
                });
              } else {
                isDependent = true;
              }
              const isRequired = column?.isReqMobile && isDependent;
              // ----------------------------------------------------------------
              // const isRequired = column?.isReqMobile;
              if (isRequired) {
                if (!value) {
                  return false;
                }
              }
              return true;
            },
          });
        }

        dataObject[column?.fieldName] = fieldValidation.nullable();
      });

      let dataValidationSchema = yup.object().shape({
        ...dataObject,
      });

      return dataValidationSchema;
    });

    switch (question?.respType) {
      case globalConstants.dynamicFormDataTypes.text:
        return yup.object().shape({
          quesResp: yup
            .string()
            .test({
              name: question?.quesTitle,
              message: `${question?.quesTitle} is Required`,
              test: function (value, context) {
                // --------------------------------
                // console.log("context--->", context);
                let isDependent = false;
                //console.log("This parent", this.parent);
                if (question?.criteriaList) {
                  question?.criteriaList?.map((item) => {
                    // console.log("item", item);
                    let parentQuestion = {};
                    item?.criVal &&
                      formData?.map((section) => {
                        section?.questions?.map((ques) => {
                          if (ques?.quesId === item?.evalQues) {
                            parentQuestion = ques;
                          }
                        });
                      });

                    if (
                      parentQuestion &&
                      Object.keys(parentQuestion).length > 0
                    ) {
                      if (
                        item?.criVal &&
                        item?.criVal?.includes(parentQuestion?.quesResp)
                      ) {
                        isDependent = true;
                        // console.log("required field");
                      }
                    }
                  });
                } else {
                  isDependent = true;
                }
                const isRequired =
                  question?.isReqMobile &&
                  question?.visibleOnMobile &&
                  isDependent;

                if (isRequired) {
                  if (!question?.quesResp) {
                    return false;
                  }
                  return true;
                }
                return true;
              },
            })

            .nullable(),
        });
     
        case globalConstants.dynamicFormDataTypes.email:
          return yup.object().shape({
            quesResp: yup
              .string()
              .test({
                name: question.quesTitle,
                message: `${question.quesTitle} is Required`,
                test: function (value) {
                  // -------------------------
                  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

                  // -----------------------
                  let isDependent = false;
                  if (question?.criteriaList) {
                    question?.criteriaList?.map((item) => {
                      let parentQuestion = {};
                      item?.criVal &&
                        formData?.map((section) => {
                          section?.questions?.map((ques) => {
                            if (ques?.quesId === item?.evalQues) {
                              parentQuestion = ques;
                            }
                          });
                        });
  
                      if (
                        parentQuestion &&
                        Object.keys(parentQuestion).length > 0
                      ) {
                        if (
                          item?.criVal &&
                          item?.criVal?.includes(parentQuestion?.quesResp)
                        ) {
                          isDependent = true;
                        }
                      }
                    });
                  } else {
                    isDependent = true;
                  }
  
                  const isRequired =
                    question?.isReqMobile &&
                    question?.visibleOnMobile &&
                    isDependent;
                  if (value !== null && value !== undefined) {
                    if (isDependent && !value.toString().match(emailRegex)) {
                      return this.createError({
                        message: "Invalid value format",
                      });
                    }
                  }
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
        case globalConstants.dynamicFormDataTypes.textarea:
        return yup.object().shape({
          quesResp: yup
            .string()
            .test({
              name: question.quesTitle,
              message: `${question.quesTitle} is Required`,
              test: function (value) {
                let isDependent = false;
                //console.log("This parent", this.parent);
                if (question?.criteriaList) {
                  question?.criteriaList?.map((item) => {
                    let parentQuestion = {};
                    item?.criVal &&
                      formData?.map((section) => {
                        section?.questions?.map((ques) => {
                          if (ques?.quesId === item?.evalQues) {
                            parentQuestion = ques;
                          }
                        });
                      });

                    if (
                      parentQuestion &&
                      Object.keys(parentQuestion).length > 0
                    ) {
                      if (
                        item?.criVal &&
                        item?.criVal?.includes(parentQuestion?.quesResp)
                      ) {
                        isDependent = true;
                      }
                    }
                  });
                } else {
                  isDependent = true;
                }

                const isRequired =
                  question?.isReqMobile &&
                  question?.visibleOnMobile &&
                  isDependent;

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
      case globalConstants.dynamicFormDataTypes.number:
        return yup.object().shape({
          quesResp: yup
            .string()
            .test({
              name: question.quesTitle,
              message: `${question.quesTitle} is Required`,
              test: function (value) {
                // -------------------------
                const pattern = /^[0-9.]+$/;
                // -----------------------
                let isDependent = false;
                //console.log("This parent", this.parent);
                if (question?.criteriaList) {
                  question?.criteriaList?.map((item) => {
                    let parentQuestion = {};
                    item?.criVal &&
                      formData?.map((section) => {
                        section?.questions?.map((ques) => {
                          if (ques?.quesId === item?.evalQues) {
                            parentQuestion = ques;
                          }
                        });
                      });

                    if (
                      parentQuestion &&
                      Object.keys(parentQuestion).length > 0
                    ) {
                      if (
                        item?.criVal &&
                        item?.criVal?.includes(parentQuestion?.quesResp)
                      ) {
                        isDependent = true;
                      }
                    }
                  });
                } else {
                  isDependent = true;
                }

                const isRequired =
                  question?.isReqMobile &&
                  question?.visibleOnMobile &&
                  isDependent;
                if (value !== null && value !== undefined) {
                  if (isDependent && !value.toString().match(pattern)) {
                    return this.createError({
                      message: "Invalid value format",
                    });
                  }
                }
                // console.log(`${question.quesTitle}`, question.quesResp);
                if (isRequired) {
                  if (!question.quesResp) {
                    return false;
                  }

                  // if (!question?.validationConfig?.pattern?.test(value)) {
                  //   return createError({ message: 'Invalid Value' });
                  // }
                  return true;
                }
                return true;
              },
            })
            .test(function (value) {
              const mobileValidationConfig = JSON.parse(
                question?.mobileValidationConfig || "{}"
              );
              const min = mobileValidationConfig?.min;
              const max = mobileValidationConfig?.max;

              if (value !== null && value !== undefined) {
                if (value && value < min) {
                  return this.createError({
                    message: "Negative values are not allowed",
                  });
                }
                if ((value && value < min) || value > max) {
                  return this.createError({
                    message: `Please enter the ${min} to ${max} value`,
                  });
                }

                //return true;
              }
              return true;
            })
            .nullable(),
          //-----------For decimal value validation------------------//
          // .test({
          //   name: question.quesTitle,
          //   message: `${question.quesTitle} is Required`,
          //   test: function (value) {
          //     const mobileValidationConfig = question?.mobileValidationConfig || {};
          //     const pattern = mobileValidationConfig?.pattern;

          //     if (value !== null && value !== undefined) {
          //       const decimalPart = (value.toString().split('.')[1] || '').length;

          //       if (decimalPart > 3) {
          //         return this.createError({
          //           message: "Up to three decimal places allowed.",
          //         });
          //       }

          //       if (!new RegExp(pattern).test(value)) {
          //         return this.createError({
          //           message: `Value does not match the pattern: ${pattern}`,
          //         });
          //       }
          //     }

          //     return true;
          //   },
          // })
        });

      case globalConstants.dynamicFormDataTypes.currency:
        return yup.object().shape({
          quesResp: yup
            .string()
            .test({
              name: question.quesTitle,
              message: `${question.quesTitle} is Required`,
              test: function (value) {
                let isDependent = false;
                //console.log("This parent", this.parent);
                if (question?.criteriaList) {
                  question?.criteriaList?.map((item) => {
                    let parentQuestion = {};
                    item?.criVal &&
                      formData?.map((section) => {
                        section?.questions?.map((ques) => {
                          if (ques?.quesId === item?.evalQues) {
                            parentQuestion = ques;
                          }
                        });
                      });

                    if (
                      parentQuestion &&
                      Object.keys(parentQuestion).length > 0
                    ) {
                      if (
                        item?.criVal &&
                        item?.criVal?.includes(parentQuestion?.quesResp)
                      ) {
                        isDependent = true;
                      }
                    }
                  });
                } else {
                  isDependent = true;
                }

                const isRequired =
                  question?.isReqMobile &&
                  question?.visibleOnMobile &&
                  isDependent;

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
            .test(function (value) {
              const mobileValidationConfig = JSON.parse(
                question?.mobileValidationConfig || "{}"
              );
              const min = mobileValidationConfig?.min;
              const max = mobileValidationConfig?.max;
              if (value !== null && value !== undefined) {
                if (value && value < min) {
                  return this.createError({
                    message: "Negative values are not allowed",
                  });
                }
                if ((value && value < min) || value > max) {
                  return this.createError({
                    message: `Please enter the ${min} to ${max} value`,
                  });
                }
                return true;
              }
              return true;
            })
            .nullable(),
        });

      case globalConstants.dynamicFormDataTypes.decimal:
        return yup.object().shape({
          quesResp: yup
            .string()
            .test({
              name: question.quesTitle,
              message: `${question.quesTitle} is Required`,
              test: function (value) {
                // ------------------------------------------------
                let isDependent = false;
                //console.log("This parent", this.parent);
                if (question?.criteriaList) {
                  question?.criteriaList?.map((item) => {
                    // console.log("item", item);
                    let parentQuestion = {};
                    item?.criVal &&
                      formData?.map((section) => {
                        section?.questions?.map((ques) => {
                          if (ques?.quesId === item?.evalQues) {
                            parentQuestion = ques;
                          }
                        });
                      });

                    if (
                      parentQuestion &&
                      Object.keys(parentQuestion).length > 0
                    ) {
                      if (
                        item?.criVal &&
                        item?.criVal?.includes(parentQuestion?.quesResp)
                      ) {
                        isDependent = true;
                      } else {
                        isDependent = false;
                      }
                    }
                  });
                } else {
                  isDependent = true;
                }
                const isRequired =
                  question?.isReqMobile &&
                  question?.visibleOnMobile &&
                  isDependent;
                // -------------------------------------------------
                // const isRequired =
                //   question?.isReqMobile && question?.visibleOnMobile;

                if (isRequired) {
                  if (!question.quesResp) {
                    return false;
                  }
                }
                return true;
              },
            })
            .test({
              name: question.quesTitle,
              //message: `${question.quesTitle} is Required`,
              test: function (value) {
                const mobValidationConfig = JSON.parse(
                  question?.mobileValidationConfig || "{}"
                );
                const min = mobValidationConfig?.min;
                //   const pattern = /^\d+(\.\d{1,3})?$/;
                //   if (value !== null && value !== undefined) {
                //     const decimalPart = (value.toString().split(".")[1] || "")
                //       .length;

                //     if (decimalPart > 3) {
                //       return this.createError({
                //         message: "Up to three decimal places allowed.",
                //       });
                //     }
                //     if (value && value < min) {
                //       return this.createError({
                //         message: "Negative values are not allowed",
                //       });
                //     }
                //     if (!new RegExp(pattern).test(value)) {
                //       return this.createError({
                //         message: `Invalid value`,
                //       });
                //     }
                //   }

                //   return true;
                // },
                const pattern = /^\d+(\.\d{1,3})?$/;

                if (value !== null && value !== undefined) {
                  const decimalPart = (value.toString().split(".")[1] || "")
                    .length;

                  // Check for negative values
                  if (value < min) {
                    return this.createError({
                      message: "Negative values are not allowed",
                    });
                  }

                  // Check if the decimal part exceeds three digits
                  if (decimalPart > 3) {
                    return this.createError({
                      message: "Up to three decimal places allowed.",
                    });
                  }
                  if (!value.toString().match(pattern)) {
                    return this.createError({
                      message: "Invalid value format",
                    });
                  }
                }

                return true;
              },
            })
            .nullable(),
        });

      case globalConstants.dynamicFormDataTypes.phone:
        return yup.object().shape({
          quesResp: yup
            .string()
            .test({
              name: question.quesTitle,
              message: `${question.quesTitle} is Required`,
              test: function (value) {
                const isRequired =
                  question?.isReqMobile && question?.visibleOnMobile;
                // console.log(`${question.quesTitle}`, question.quesResp);
                // console.log(
                //   `${question.quesTitle}`,
                //   // question?.validationConfig?.pattern?.test('12345'),
                //   question?.validationConfig?.pattern,
                //   value
                // );
                if (isRequired) {
                  if (!question?.quesResp) {
                    return false;
                  }

                  return true;
                }
                return true;
              },
            })
            .test(async function (value) {
              try {
                const mobileValidationConfigString =
                  question?.mobileValidationConfig.trim();
                const mobileValidationConfig = JSON.parse(
                  mobileValidationConfigString || "{}"
                );
                const patternString = mobileValidationConfig?.pattern;
                const pattern = patternString
                  ? new RegExp(patternString)
                  : null;
                if (!value || value.trim().length === 0) {
                  return true;
                }
                if (pattern && !pattern.test(value)) {
                  return this.createError({
                    message: "Invalid phone number",
                  });
                }

                return true;
              } catch (error) {
                console.error("Error during validation:", error);
                return false;
              }
            })

            .nullable(),
        });
      case globalConstants.dynamicFormDataTypes.date:
        return yup.object().shape({
          quesResp: yup
            .string()
            .test({
              name: question.quesTitle,
              message: `${question.quesTitle} is Required`,
              test: function (value) {
                const isRequired =
                  question?.isReqMobile && question?.visibleOnMobile;
                // console.log(`${question.quesTitle}`, question.quesResp);
                if (isRequired) {
                  if (!question?.quesResp) {
                    return false;
                  }
                  return true;
                }
                return true;
              },
            })

            // .test(function (value) {
            //   const isSameDay = (date1, date2) => {
            //     return (
            //       date1.getFullYear() === date2.getFullYear() &&
            //       date1.getMonth() === date2.getMonth() &&
            //       date1.getDate() === date2.getDate()
            //     );
            //   };
            //   const mobileValidationConfig =
            //     question?.mobileValidationConfig !== null
            //       ? JSON.parse(question?.mobileValidationConfig || '{}')
            //       : {};

            //   const dateAllowed = mobileValidationConfig?.isPastDateAllowed;

            //   if (
            //     !dateAllowed &&
            //     Object.keys(mobileValidationConfig).length > 0
            //   ) {
            //     const dob = new Date(value);

            //     const currentDate = new Date();

            //     if (dob < currentDate && !isSameDay(dob, currentDate)) {
            //       return this.createError({
            //         message: 'Selected Date should not be in Past',
            //       });
            //     }
            //   }
            //   return true; // Validation passes
            // })

            .nullable(),
        });
      case globalConstants.dynamicFormDataTypes.picklist:
        return yup.object().shape({
          quesResp: yup
            .string()
            .test({
              name: question.quesTitle,
              message: `${question.quesTitle} is Required`,
              test: function (value) {
                // ------------------------------------------------
                let isDependent = false;
                //console.log("This parent", this.parent);
                if (question?.criteriaList) {
                  question?.criteriaList?.map((item) => {
                    // console.log("item", item);
                    let parentQuestion = {};
                    item?.criVal &&
                      formData?.map((section) => {
                        section?.questions?.map((ques) => {
                          if (ques?.quesId === item?.evalQues) {
                            parentQuestion = ques;
                          }
                        });
                      });

                    if (
                      parentQuestion &&
                      Object.keys(parentQuestion).length > 0
                    ) {
                      if (
                        item?.criVal &&
                        item?.criVal?.includes(parentQuestion?.quesResp)
                      ) {
                        isDependent = true;
                      } else {
                        isDependent = false;
                      }
                    }
                  });
                } else {
                  isDependent = true;
                }
                const isRequired =
                  question?.isReqMobile &&
                  question?.visibleOnMobile &&
                  isDependent;
                // console.log(`${question.quesTitle}`, question.quesResp);
                if (isRequired) {
                  if (!question?.quesResp) {
                    return false;
                  }
                  return true;
                }
                return true;
              },
            })
            .nullable(),
        });
      case globalConstants.dynamicFormDataTypes.radio:
        return yup.object().shape({
          quesResp: yup
            .string()
            .test({
              name: question.quesTitle,
              message: `${question.quesTitle} is Required`,
              test: function (value) {
                const isRequired =
                  question?.isReqMobile && question?.visibleOnMobile;
                // console.log(`${question.quesTitle}`, question.quesResp);
                if (isRequired) {
                  if (!question?.quesResp) {
                    return false;
                  }
                  return true;
                }
                return true;
              },
            })
            .nullable(),
        });
      case globalConstants.dynamicFormDataTypes.file:
        return yup.object().shape({
          quesResp: yup
            .array()
            .test({
              name: question.quesTitle,
              message: "Upload the Required File.",
              test: function (value) {
                const isRequired =
                  question?.isReqMobile && question?.visibleOnMobile;
                const fileConfig = JSON.parse(question?.fileConfig);
                console.log(`${question.quesTitle}`, fileConfig?.MinFileCount);
                if (isRequired) {
                  if (question?.quesResp?.length < 1) {
                    return false;
                  }
                  if (question?.quesResp?.length < fileConfig?.MinFileCount) {
                    // return false;
                    return this.createError({
                      message: `Min. ${fileConfig?.MinFileCount} Photos are Required.`,
                    });
                  }

                  return true;
                }
                return true;
              },
            })
            .nullable(),
        });

      case globalConstants.dynamicFormDataTypes.video:
        return yup.object().shape({
          quesResp: yup
            .array()
            .test({
              name: question.quesTitle,
              message: "Upload the Required Video",
              test: function (value) {
                const isRequired =
                  question?.isReqMobile && question?.visibleOnMobile;
                console.log(`${question.quesTitle}`, question.quesResp);
                if (isRequired) {
                  if (question?.quesResp?.length < 1) {
                    return false;
                  }
                  return true;
                }
                return true;
              },
            })
            .nullable(),
        });

      case globalConstants.dynamicFormDataTypes.reference:
        return yup.object().shape({
          quesConfig: yup
            .object()
            .shape({
              data: yup.array().of(getQuesConfigValidationSchema),
            })
            .nullable(),
        });
      case globalConstants.dynamicFormDataTypes.table:
        return yup.object().shape({
          quesConfig: yup
            .object()
            .shape({
              data: yup.array().of(getQuesConfigValidationSchema),
            })
            .nullable(),
        });
      default:
        return yup.mixed().notRequired();
    }
  });

  node = yup.object().shape({
    PD: yup.array().of(
      yup.object().shape({
        questions: yup.array().of(getpdQuestionsValidationSchema),
      })
    ),
  });

  return node;
};
