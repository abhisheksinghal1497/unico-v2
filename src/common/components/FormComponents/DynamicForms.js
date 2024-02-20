// import React, { useEffect, useState } from 'react';
// import { useForm, Controller } from 'react-hook-form';
// import { View, Text, StyleSheet } from 'react-native';
// import { Dialog, List, Button, Portal, TextInput } from 'react-native-paper'; // Import TextInput from react-native-paper
// import { horizontalScale, verticalScale } from '../../../utils/matrcis';
// import { colors } from '../../colors';
// import customTheme from '../../colors/theme';
// import Touchable from '../TouchableComponent/Touchable';
// import { ScrollView } from 'react-native-gesture-handler';
// import Accordion from '../AccordionComponent/Accordion';

// const DynamicForm = ({ formData, isDisabled =  false }) => {
//   const { control, handleSubmit, setValue } = useForm();

//   useEffect(() => {
//     // Populate form fields with default values from JSON data
//     formData.PDResponseWrapper.forEach((section) => {
//       section.questions.forEach((question) => {
//         setValue(question.quesId, question.quesResp || '');
//       });
//     });
//   }, [formData, setValue]);

//   const onSubmit = (data) => {
//     // Handle form submission
//     console.log(data);
//   };

//   const [visible, setVisible] = useState(false);
//   // const [selectedItem, setSelectedItem] = useState(null);
//   const openMenu = () => setVisible(true);
//   const closeMenu = () => setVisible(false);

//   const showDialog = () => {
//     !isDisabled && setVisible(true);
//   };
//   const hideDialog = () => {
//     setVisible(false);
//   };

//   return (
//     <View>
//       {formData.PDResponseWrapper.map((section, index) => (
//         <Accordion
//         title={section.sectionTitle}
//         Id={"LoanDetails"}
//         collapsedError={false}
//         initialState={false}
//       >
//         <View key={index}>

//           {/* <Text>{section.sectionTitle}</Text> */}
//           {section.questions.map((question, qIndex) => (
//             <View key={qIndex}>
//                 {question.respType === 'Number' && (
//               <Controller
//                 name={question.quesId}
//                 control={control}
//                 render={({ field: { onChange, onBlur, value } }) => (
//                   <TextInput
//                     label={question.quesTitle} // Use the question title as a label
//                     value={value}
//                     onBlur={onBlur}
//                     onChangeText={(text) => onChange(text)}
//                   />
//                 )}
//               />
//               )}
//               {question.respType === 'Picklist' && (
//                 <Controller
//                   name={question.quesId}
//                   control={control}
//                   render={({ field: { onChange, onBlur } }) => (
//                     <View style={styles.container}>
//               <View style={styles.labelContainer}>

//               </View>
//               <Touchable disabled={isDisabled} onPress={showDialog}>
//                 <TextInput

//                   onBlur={onBlur}
//                   value={question.quesTitle ? question.quesTitle : "Select"}
//                   onChangeText={(value) => {
//                     onChange(value);
//                   }}
//                   //error={error?.message}
//                   editable={false}
//                   disabled={isDisabled}
//                   style={styles.textInput}
//                   // on={() => showDialog}
//                   right={
//                     <TextInput.Icon
//                       icon={visible ? "chevron-up" : "chevron-down"}
//                       onPress={showDialog}
//                     />
//                   }
//                   // {...rest}
//                 />
//                 {/* {error?.message && (
//                   <Text style={styles.errorMessage}>{error?.message}</Text>
//                 )} */}
//               </Touchable>
//               <Portal>
//               <Dialog visible={visible} onDismiss={hideDialog}>
//                   <Dialog.Title>
//                     <Text style={styles.dialogHeader}>{question.quesTitle}</Text>
//                     {/* <Dialog.Icon icon="window-close" /> */}
//                   </Dialog.Title>
//                   <Dialog.ScrollArea>
//                       <List.Section>
//                         <ScrollView style={styles.scrollContainer}>
//                           {question.possibleOptions &&
//                             question.possibleOptions.length > 0 &&
//                             question.possibleOptions.map((item) => (
//                               <List.Item
//                                 key={item}
//                                 titleNumberOfLines={2}
//                                 title={item}
//                                 onPress={() => {
//                                   handleSelect(item);
//                                 }}
//                               />
//                             ))}
//                         </ScrollView>
//                       </List.Section>
//                     </Dialog.ScrollArea>
//                     <Dialog.Actions>
//                     <Button mode="text" onPress={hideDialog}>
//                       Cancel
//                     </Button>
//                   </Dialog.Actions>
//                 </Dialog>
//                   </Portal>
//             </View>
//                   )}
//                 />
//               )}
//             </View>
//           ))}
//         </View>
//         </Accordion>
//       ))}
//       <Button title="Next" onPress={handleSubmit(onSubmit)} />
//     </View>
//   );
// };

// export default DynamicForm;
// const styles = StyleSheet.create({
//   container: {
//     marginHorizontal: horizontalScale(8),
//     marginVertical: verticalScale(6),
//     paddingBottom: 0,
//   },
//   asterisk: {
//     color: colors.asteriskRequired,
//   },
//   scrollContainer: {
//     maxHeight: verticalScale(280),
//   },
//   labelContainer: {
//     flexDirection: "row",
//     alignItems: "flex-end",
//     marginBottom: 2,
//   },
//   errorMessage: {
//     color: customTheme.colors.error,
//     marginTop: verticalScale(2),
//   },
//   textInput: {
//     backgroundColor: customTheme.colors.textInputBackground,
//   },
//   dialogHeader: {
//     fontFamily: customTheme.fonts.titleMedium.fontFamily,
//     fontSize: customTheme.fonts.titleMedium.fontSize,
//     fontWeight: customTheme.fonts.titleMedium.fontWeight,
//     letterSpacing: customTheme.fonts.titleMedium.letterSpacing,
//     lineHeight: customTheme.fonts.titleMedium.lineHeight,
//     color: customTheme.colors.primary,
//   },
// });
