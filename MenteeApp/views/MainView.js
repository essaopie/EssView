import React, { useRef, useState } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { MaterialIcons } from "react-native-vector-icons";
import { CameraView } from 'expo-camera';
import axios from 'axios';
import * as Speech from 'expo-speech';
import * as Animatable from 'react-native-animatable';

const OCR_API_URL = 'https://api.ocr.space/parse/image'; // OCR Space API endpoint
const API_KEY = 'K83012385988957'; // Replace with your OCR Space API key

const MainView = ({ navigation }) => {
  const cameraRef = useRef(null);
  const [facing, setFacing] = useState('back');
  const [ocr, setOcr] = useState();
  const [isSpeaking, setIsSpeaking] = useState(false); // New state to track if speech is ongoing
  const [selectedMode, setSelectedMode] = useState('Outdoor'); // State to track selected mode

  const speak = (thingToSay) => {
    setIsSpeaking(true); // Set speaking state to true when speech starts
    Speech.speak(thingToSay, { 
      language: 'en-EN', 
      onDone: () => setIsSpeaking(false), // Reset the speaking state when speech is done
    });
  };

  const sendCameraData = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
          skipProcessing: true,
          quality: 1, 
        });

        // Create FormData payload
        const formData = new FormData();
        formData.append('base64Image', photo.base64);
        formData.append('isOverlayRequired', 'false');
        formData.append('detectOrientation', 'true');
        formData.append('isTable', 'true'); // Optimize for structured data
        formData.append('filetype', 'PNG');
        formData.append('OCREngine', '2'); // Use advanced engine

        // Make API request with axios
        const response = await axios.post(OCR_API_URL, formData, {
          headers: {
            'apikey': API_KEY,
            'Content-Type': 'multipart/form-data',
          },
        });

        // Handle response
        if (response.data?.ParsedResults?.[0]?.ParsedText) {
          const ocrText = response.data.ParsedResults[0].ParsedText;
          setOcr(ocrText);
          console.log('OCR Success:', ocrText);
          speak(ocrText); // Speak OCR result
        } else {
          console.log('OCR Error:', response.data?.ErrorMessage || 'No text found');
        }
      } catch (error) {
        console.error('OCR Failed:',
          error.response?.data?.ErrorMessage ||
          error.message ||
          'Unknown error'
        );
      }
    }
  };

  // Toggle selected mode
  const toggleMode = () => {
    setSelectedMode(prevMode => (prevMode === 'Outdoor' ? 'Indoor' : 'Outdoor'));
  };

  return (
    <>
          <CameraView ref={cameraRef} facing={facing} style={{ position: 'absolute' }} />
      
    <SafeAreaView style={styles.container}>

      {/* Outdoor Mode Card */}
      <TouchableOpacity
        style={[styles.card, selectedMode === 'Outdoor' && styles.selectedCard]}
        onPress={toggleMode} // Toggle mode when the card is clicked
      >
        <View style={styles.textContainer}>
          <Text style={styles.title}>Mode:</Text>
          <Text style={styles.mode}>Outdoor</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={() => navigation.navigate('WhatToHear')} style={styles.button} labelStyle={styles.buttonLabel}>
            <MaterialIcons name={"settings"} size={24} color={"white"} />
          </Button>
        </View>
      </TouchableOpacity>

      {/* Indoor Mode Card */}
      <TouchableOpacity
        style={[styles.card, selectedMode === 'Indoor' && styles.selectedCard]}
        onPress={toggleMode} // Toggle mode when the card is clicked
      >
        <View style={styles.textContainer}>
          <Text style={styles.title}>Mode:</Text>
          <Text style={styles.mode}>Indoor</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={() => navigation.navigate('WhatToHear')} style={styles.button} labelStyle={styles.buttonLabel}>
            <MaterialIcons name={"settings"} size={24} color={"white"} />
          </Button>
        </View>
      </TouchableOpacity>

      <View style={{ margin: 20 }}></View>

      {/* OCR Button */}
      <Animatable.View
        animation={isSpeaking ? 'pulse' : undefined} // Animate button when speaking
        iterationCount="infinite"
        duration={500}
        style={[styles.ocrButton, isSpeaking && styles.speakingButton]} // Conditionally apply red color
      >
        <Button onPress={() => sendCameraData()}>
          <View style={styles.ocrCard}>
            <Text style={styles.ocrText}>OCR (Text to speech)</Text>
          </View>
        </Button>
      </Animatable.View>
    </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    width: 340,
    paddingTop: 50,
    paddingBottom: 50,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  selectedCard: {
    borderWidth: 3,
    borderColor: '#007AFF', // Highlight the selected mode card
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  mode: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  buttonContainer: {
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  buttonLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  ocrCard: {
    backgroundColor: '#FFF',
    width: 340,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ocrText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  ocrButton: {
    backgroundColor: '#007AFF',
    borderRadius: 15,
  },
  speakingButton: {
    backgroundColor: 'red', // Red color while speaking
  },
});

export default MainView;
