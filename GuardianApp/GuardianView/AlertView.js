import { View, StyleSheet, SafeAreaView, StatusBar, Platform, ScrollView } from 'react-native';
import React from 'react';
import { Button, Text, TextInput } from 'react-native-paper';
import DataElement from './DataElement';
import History from './History';
import { MaterialIcons } from 'react-native-vector-icons';

const AlertView = () => {
  const [text, setText] = React.useState('');

  return (
    <SafeAreaView style={styles.container}>
      <Text variant="headlineMedium" style={styles.heading}>
        Send Alert
      </Text>

      <TextInput
        style={styles.textInput}
        label="Enter Alert"
        mode="outlined"
        value={text}
        onChangeText={(text) => setText(text)}
      />

      <Button
        mode="contained"
        onPress={() => console.log('Pressed')}
        style={styles.button}
        
        labelStyle={styles.buttonText}
      >
        <MaterialIcons name={"send"} size={20} color={"white"} /><Text style={{fontWeight: 'bold', color: 'white', marginLeft: 10}}>SEND</Text>
      </Button>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <DataElement data="14.03.2025" />
        <History Alert="Im coming to you" time="16:25" />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 16,
  },
  heading: {
    marginVertical: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textInput: {
    width: 380,
    marginBottom: 10,
  },
  button: {
    width: '50%',
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#3a7ae8'
  },
  buttonText: {
    fontSize: 16,
  },
  scrollView: {
    width: '100%',
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 20,
  },
});

export default AlertView;
