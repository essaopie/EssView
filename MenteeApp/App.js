import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import io from 'socket.io-client';
import * as Speech from 'expo-speech';
import FilterOutdoor from './views/FilterOutdoor';
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import MainView from './views/MainView';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
const socket = io('https://techquest.ramteam.pl');

const HomeScreen = ({ navigation }) => {
  const [connected, setConnected] = useState(false);
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const lastSpokenObject = useRef(null); // Track last spoken object

  const speak = (thingToSay) => {
    Speech.speak(thingToSay, { language: 'en-EN' });
  };

  useEffect(() => {
    if (!permission) return;
    if (!permission.granted) {
      requestPermission();
    }
  }, [permission]);

  useEffect(() => {
    socket.on('connect', () => {
      setConnected(true);
      console.log('Connected to server');
      socket.emit('message', 'Hello, server!');
    });

    socket.on('results', (data) => {
      console.clear();
      try {
        const parsedData = JSON.parse(data);
        const frontObject = parsedData[1]?.ObjectsInfront?.object;
        const leftObject = parsedData[2]?.ObjectsOnLeft?.object;
        const rightObject = parsedData[3]?.ObjectsOnRight?.object;

        let detectedObject = null;
        let message = '';

        if (frontObject && frontObject !== 'none') {
          detectedObject = frontObject;
          message = frontObject;
        } else if (leftObject && leftObject !== 'none') {
          detectedObject = leftObject;
          message = `${leftObject} is on your left`;
        } else if (rightObject && rightObject !== 'none') {
          detectedObject = rightObject;
          message = `${rightObject} is on your right`;
        }

        if (detectedObject && detectedObject !== lastSpokenObject.current) {
          speak(message);
          console.log(detectedObject)
          lastSpokenObject.current = detectedObject; // Update last spoken object
        }
      } catch (error) {
        console.error('Error parsing data:', error);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendCameraData = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ base64: true });
      socket.emit('cameraview', photo.base64);
    }
  };

  useEffect(() => {
    const interval = setInterval(sendCameraData, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!permission?.granted) {
    return (
      <View>
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  return (
    <View>
      <Button title="Capture Image" onPress={sendCameraData} />
      <CameraView ref={cameraRef} facing="back" style={{ position: 'absolute' }} />
      <FilterOutdoor />
    </View>
  );
};

const App = () => {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#2179de',
    },
  };

  return (
    <NavigationContainer>
      <PaperProvider theme={theme}>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={MainView} />
          <Stack.Screen name="WhatToHear" component={HomeScreen} />
        </Stack.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
};

export default App;
