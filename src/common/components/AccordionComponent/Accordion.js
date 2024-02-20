import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { List } from 'react-native-paper';
import { AccordionStyles } from './AccordionStyle';
import { colors } from '../../colors';
import { useEffect } from 'react';

const Accordion = ({ children, title, Id, collapsedError, initialState }) => {
  // console.log('initial State', initialState);
  const [isExpanded, setIsExpanded] = useState(initialState);

  const handleAccordionToggle = useCallback(() => {
    setIsExpanded((prevExpanded) => !prevExpanded);
  }, []);

  useEffect(() => {
    setIsExpanded(collapsedError);
  }, [collapsedError]);

  useEffect(() => {
    setIsExpanded(initialState);
  }, []);
   
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

export default Accordion;
