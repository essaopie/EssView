import React, { useState } from 'react';
import { List, IconButton, Divider, Button } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

export default function FilterOutdoor() {
  const [isBicycleOn, setIsBicycleOn] = useState(true);
  const [isPeopleTalkingOn, setIsPeopleTalkingOn] = useState(false);

  const toggleBicycle = () => setIsBicycleOn(!isBicycleOn);
  const togglePeopleTalking = () => setIsPeopleTalkingOn(!isPeopleTalkingOn);

  return (
    <View style={styles.container}>
      <List.Section style={styles.section}>
        <List.Subheader style={styles.subheader}>Select what you want to hear</List.Subheader>
        
        <List.Item
          title={`Bikes - ${isBicycleOn ? 'ON' : 'OFF'}`}
          left={() => (
            <List.Icon
              icon={isBicycleOn ? "check-circle" : "close-circle"}
              color={isBicycleOn ? "#4CAF50" : "#F44336"}
              style={styles.icon}
            />
          )}
          onPress={toggleBicycle} 
          style={styles.item}
          accessibilityLabel={`Przełącznik roweru, stan: ${isBicycleOn ? 'ON' : 'OFF'}`}
          accessibilityHint="Naciśnij, aby przełączyć stan roweru"
        />
        <Divider />
        <List.Item
          title={`Cars - ${isPeopleTalkingOn ? 'ON' : 'OFF'}`}
          left={() => (
            <List.Icon
              icon={isPeopleTalkingOn ? "check-circle" : "close-circle"}
              color={isPeopleTalkingOn ? "#4CAF50" : "#F44336"}
              style={styles.icon}
            />
          )}
          onPress={togglePeopleTalking} 
          style={styles.item}
          accessibilityLabel={`Przełącznik gadania ludzi, stan: ${isPeopleTalkingOn ? 'ON' : 'OFF'}`}
          accessibilityHint="Naciśnij, aby przełączyć stan gadania ludzi"
        />
      </List.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
  },
  subheader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000', 
    padding: 12,
  },
  item: {
    paddingVertical: 30, 
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  icon: {
    marginRight: 16,
    size: 28, 
  },
});
