import React, { useState, useEffect } from "react";
import { View, Button, Image, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";


const OCRScreen = ({ base64Image }) => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");

  useEffect(() => {
    if (base64Image) {
      processImage(base64Image);
    }
  }, [base64Image]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ base64: true });
    if (!result.canceled) {
      setImage(result.uri);
      processImage(result.base64);
    }
  };

  const processImage = async (base64) => {

  };

  return (
    <View>
      <Button title="Pick an image" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      <Text>Extracted Text: {text}</Text>
    </View>
  );
};

export default OCRScreen;