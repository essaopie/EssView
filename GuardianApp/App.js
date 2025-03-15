import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, View, ScrollView } from 'react-native';
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import { MaterialIcons } from 'react-native-vector-icons';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from './node_modules/@react-navigation/bottom-tabs/lib/module/navigators/createBottomTabNavigator';
import AlertView from './GuardianView/AlertView';
import MapScreen from './GuardianView/MapScreen';

const Tab = createBottomTabNavigator();

function HomeScreen({ navigation }) {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#3a7ae8',
      secondary: '#3a7ae8',
    },
  };

  // Notification list with types for dynamic icon colors and border colors
  const notifications = [
    { id: '7', text: 'Camera connection is alive', type: 'success', icon: 'check-circle' },
    { id: '2', text: 'Person is on the left (20m)', type: 'info', icon: 'message' },
    { id: '3', text: 'Bench is on the right (15m)', type: 'info', icon: 'message' },
    { id: '4', text: 'Person is on the left (40m)', type: 'info', icon: 'message' },
    { id: '5', text: 'Person is on the left (20m)', type: 'info', icon: 'message' },
    { id: '6', text: 'Car is in front (2m) (1s)', type: 'danger', icon: 'error' }
  ];

  // Determine icon and border color based on notification type
  const getIconColor = (type) => {
    switch (type) {
      case 'danger':
        return '#e8524a';
      case 'info':
        return '#64a4e8';
      case 'success':
        return '#64e8a8';
      default:
        return 'black';
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'danger':
        return '#e8524a';
      case 'info':
        return '#64a4e8';
      case 'success':
        return '#64e8a8';
      default:
        return '#ccc';
    }
  };

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <CameraView style={styles.camera} facing={facing}>
          <View style={styles.buttonContainer}>
            {/* Camera control button (if needed) */}
          </View>
        </CameraView>

        {/* Scrollable Notifications */}
        <ScrollView style={styles.notificationsContainer}>
          {notifications.map((notification) => (
            <View
              key={notification.id}
              style={[styles.notification, { borderColor: getBorderColor(notification.type) }]} // Set dynamic border color
            >
              <MaterialIcons
                name={notification.icon}
                size={24}
                color={getIconColor(notification.type)} // Set dynamic icon color
              />
              <Text style={styles.notificationText}>{notification.text}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.otherContent}>
          <Text
            style={{ fontSize: 20, textAlign: 'center' }}
            onPress={() => navigation.navigate('Alert')}>
            To send a message press here
          </Text>
        </View>
      </View>
    </PaperProvider>
  );
}

function DetailsScreen() {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, textAlign: 'center' }}>This is the Alert Screen</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          tabBarActiveTintColor: '#3a7ae8',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: '#f2f2f2',
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="home" color={color} size={size} />
            ),
          }}
        />

        <Tab.Screen
          name="Alert"
          component={AlertView}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="info" color={color} size={size} />
            ),
          }}
        />

        <Tab.Screen
          name="Map"
          component={MapScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="map" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    width: '100%',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    marginTop: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  otherContent: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 20,
  },
  notificationsContainer: {
    flex: 1,
    marginTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 2, // Add border width
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  notificationText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#121212',
  },
});
