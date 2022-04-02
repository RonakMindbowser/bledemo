import React, { } from 'react';
import {
  View, StyleSheet, StatusBar
} from 'react-native';
import AppContainer from './src/navigator/AppNavigator';
import messaging from "@react-native-firebase/messaging"
import PushNotificationService from './src/pushnotification/PushNotificationService';
import ShareExtension from 'react-native-share-extension'
import NavigationService from './src/navigator/NavigationService';

export default function RNApp() {

  React.useEffect(() => {

    shareListener()

  }, []);

  const shareListener = async () => {
    const { type, value } = await ShareExtension.data()
    console.log("share data--->", type, value);

    if (type && value) {
      NavigationService.navigate("HandleShareComponent")
    }

  }


  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={"#f7fbfc"} barStyle='dark-content' />
      <AppContainer />
      <PushNotificationService />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7fbfc",
  },
  textInput: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    color: "black",
    marginVertical: 20,
    marginHorizontal: 10
  }
})