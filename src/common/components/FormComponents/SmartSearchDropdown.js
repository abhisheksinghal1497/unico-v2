import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";

import {
  Button,
  Text,
  TextInput,
  List,
  Dialog,
  Searchbar,
  Portal,
} from "react-native-paper";

import { Controller } from "react-hook-form";
import { colors } from "../../colors";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import customTheme from "../../colors/theme";
import { horizontalScale, verticalScale } from "../../../utils/matrcis";
import Touchable from "../TouchableComponent/Touchable";

const SmartSearchDropdown = ({
  control,

  validationProps,

  name,

  label,

  options,

  setValue,

  isDisabled = false,

  DropdownProps,
  watch,

  required = false,
  isVisible = true,
}) => {
  const [visible, setVisible] = useState(false);

  const [optionData, setOptionData] = useState(options);
  const [searchQuery, setSearchQuery] = useState("");
  const [optionsVisible, setOptionsVisible] = useState(false);

  const showDialog = () => {
    !isDisabled && setVisible(true);
  };

  // console.log('options', optionsVisible);
  // console.log('optionsData', optionData);

  const hideDialog = () => {
    setVisible(false);

    setSearchQuery("");

    setOptionsVisible(false);

    setOptionData(options);
  };

  useEffect(() => {
    setOptionData(options);
  }, [options]);

  // --------------------Search handler----------------------------

  const handleSearch = (query) => {
    const formattedQuery = query.toLowerCase().trim();
    // console.log('formattedQuery', formattedQuery);
    if (formattedQuery) {
      // Filter the data based on the search query

      if (formattedQuery === "%") {
        // Show all options when '%' Sign is there
        setOptionsVisible(true);
        setOptionData(options);
        setSearchQuery(query);
      } else {
        setOptionsVisible(true);

        // const filteredList = options.filter((item) => {
        //   const itemText = `${item.label}`.toLowerCase();

        //   return itemText.includes(formattedQuery);
        // });,console.log()
        // console.log("options Data", options);
        const filteredList = options.filter((item) => {
          const itemText = item?.label?.toLowerCase();
          if (formattedQuery.length === 1) {
            const itemWords = itemText?.split(" ");
            const match = itemWords?.some((word) => {
              return word.charAt(0) === formattedQuery;
            });

            return match;
          } else {
            return itemText?.includes(formattedQuery);
          }
        });

        setOptionData(filteredList);
        setSearchQuery(query);
      }
    } else {
      // -------Resetting the List View if Search String is empty---------------
      setOptionsVisible(false);
      setOptionData(options);
      setSearchQuery(query);
    }
  };

  // -----------------Handle Dropdown Value Selection---------------------

  const handleSelect = (item) => {
    setValue(name, item.value);
    if (name === "Pincode__c" && watch().LeadSource !== "Direct-RM") {
      setValue("Br_Manager_Br_Name", "");
    }

    hideDialog();
  };

  // -------------------------------------------------------------------
  if (!isVisible) {
    return null; // If isVisible is false, the component won't be rendered
  }
  return (
    <View>
      <Controller
        control={control}
        rules={validationProps}
        render={({
          field: { onChange, onBlur, value, name },

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
              <Touchable disabled={isDisabled} onPress={showDialog}>
                <TextInput
                  value={value ? value : "Select"}
                  onChangeText={(value) => onChange(value)}
                  onPress={showDialog}
                  editable={false}
                  error={error?.message}
                  disabled={isDisabled}
                  style={styles.textInput}
                  returnKeyType="done"
                  right={
                    <TextInput.Icon
                      icon={visible ? "chevron-up" : "chevron-down"}
                      onPress={showDialog}
                    />
                  }
                />

                {error?.message && (
                  <Text style={styles.errorMessage}>{error?.message}</Text>
                )}
              </Touchable>

              <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                  <Dialog.Title>
                    <Text style={styles.dialogHeader}>{label}</Text>
                  </Dialog.Title>
                  {/* <Dialog.Actions> */}

                  {/* </Dialog.Actions> */}
                  <Dialog.ScrollArea>
                    <Searchbar
                      placeholder="Search..."
                      onChangeText={handleSearch}
                      value={searchQuery}
                      onClearIconPress={() => {
                        setSearchQuery("");
                        setOptionsVisible(false);
                        setOptionData(options);
                      }}
                      mode="view"
                    />

                    <View style={styles.scrollContainer}>
                      {optionsVisible && (
                        <FlatList
                          data={optionData}
                          keyExtractor={(item, index) =>
                            `${item.value?.toString()}${index}`
                          }
                          renderItem={({ item }) => {
                            return (
                              <List.Item
                                title={item.label}
                                titleNumberOfLines={2}
                                onPress={() => {
                                  handleSelect(item);
                                  onChange(item?.value);
                                }}
                              />
                            );
                          }}
                        />
                      )}
                    </View>
                  </Dialog.ScrollArea>

                  <Dialog.Actions>
                    <Button mode="text" onPress={hideDialog}>
                      Cancel
                    </Button>
                  </Dialog.Actions>
                </Dialog>
              </Portal>
            </View>
          );
        }}
        name={name}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: horizontalScale(8),

    marginVertical: verticalScale(6),

    paddingBottom: 0,
  },

  asterisk: {
    color: colors.asteriskRequired,
  },

  scrollContainer: {
    maxHeight: verticalScale(280), // Set the maximum height for the scrollable list
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 2,
  },

  errorMessage: {
    color: customTheme.colors.error,

    marginTop: verticalScale(2),
  },

  textInput: {
    backgroundColor: customTheme.colors.textInputBackground,
  },

  dialogHeader: {
    fontFamily: customTheme.fonts.titleMedium.fontFamily,

    fontSize: customTheme.fonts.titleMedium.fontSize,

    fontWeight: customTheme.fonts.titleMedium.fontWeight,

    letterSpacing: customTheme.fonts.titleMedium.letterSpacing,

    lineHeight: customTheme.fonts.titleMedium.lineHeight,

    color: customTheme.colors.primary,
  },
});

export default SmartSearchDropdown;
