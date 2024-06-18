import React, { useState,useEffect } from 'react';
import { View } from 'react-native';
import { List } from 'react-native-paper';
import { AccordionStyles } from '../../AccordionComponent/AccordionStyle';
import { colors } from '../../../colors';


const DynamicFormAccordion = ({ children, title, Id, collapsedError, initialState,collapseAllAccordion, setCollapseAllAccordion }) => {
  // console.log('initial State', initialState);
  const [isExpanded, setIsExpanded] = useState(initialState);

  const handleAccordionToggle = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    setIsExpanded(collapsedError);
  }, [collapsedError]);

  useEffect(() => {
    setIsExpanded(initialState);
  }, []);
   
  useEffect(() => {
    if(!collapseAllAccordion){
    setIsExpanded(collapseAllAccordion);

    setCollapseAllAccordion(true);
    }
  }, [collapseAllAccordion]);
  return (
    <View style={AccordionStyles.container}>
      <List.Accordion
        title={title}
        id={Id}
        titleStyle={AccordionStyles.titleStyle}
        style={colors.gray200}
        expanded={isExpanded}
        onPress={handleAccordionToggle}
      >
        {children}
      </List.Accordion>
    </View>
  );
};

export default DynamicFormAccordion;
