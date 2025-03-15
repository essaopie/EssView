import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

const History = ({ Alert, time }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.alertText}>{Alert}</Text>
      <Text style={styles.timeText}>{time}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    backgroundColor: '#F5F5F5', 
    borderRadius: 12, 
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginVertical: 6, 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'left',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666', 
    flex: 1,
    textAlign: 'right',
  },
});

export default History;
