import { View, StyleSheet } from 'react-native';
import React from 'react';
import { Text } from 'react-native-paper';

const DataElement = ({ data }) => {
  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.text}>
        {data}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5', 
    width: '90%',
    alignSelf: 'center',
    borderRadius: 12, 
    paddingVertical: 12, 
    paddingHorizontal: 15,
    marginVertical: 6, 
    borderWidth: 1,
    borderColor: '#DDD', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, 
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333', 
  },
});

export default DataElement;
