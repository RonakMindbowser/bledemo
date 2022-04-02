import React, { Component, useState } from 'react';
import { AppState, Platform } from 'react-native';
import messaging from "@react-native-firebase/messaging"
import PushNotification, { Importance } from 'react-native-push-notification';

export default function PushNotificationService() {
    const [appState, setAppState] = useState(AppState.currentState);

    PushNotification.configure({
        onAction: (notification) => {
            console.log("notification::", notification);
        }
    })

    React.useEffect(() => {
        const subscribe = AppState.addEventListener('change', handleAppStateChange);

        checkPermission()
        subscribeListener()

        return () => {
            subscribe.remove()
        }
    }, []);

    const handleAppStateChange = (nextAppState) => {
        if (
            appState.match(/inactive|background/) &&
            nextAppState === 'active'
        ) {
            console.log('App has come to the foreground!');
        }
        setAppState(nextAppState)
    };

    /**check the notification permission */
    const checkPermission = async () => {
        const hasPermission = await messaging().hasPermission();
        const enabled = hasPermission === messaging.AuthorizationStatus.AUTHORIZED || hasPermission === messaging.AuthorizationStatus.PROVISIONAL;
        if (hasPermission === messaging.AuthorizationStatus.AUTHORIZED || hasPermission === messaging.AuthorizationStatus.PROVISIONAL) {
            await getFCMToken();
        }
        else if (hasPermission === messaging.AuthorizationStatus.DENIED || hasPermission === messaging.AuthorizationStatus.NOT_DETERMINED) {
            const isPermission = await requestUserPermission();
            if (!isPermission) {
                return false;
            }
            else getFCMToken();
        }
        else {
            const isPermission = await requestUserPermission();
            if (!isPermission) {
                return false;
            }
            else getFCMToken();
        }
    }

    /**request notification permission */
    const requestUserPermission = async () => {
        const settings = await messaging().requestPermission({
            provisional: false,
        });
        if (settings) {
            return settings;
        }
    }

    /**gets the fcm token */
    const getFCMToken = async () => {
        const token = await messaging().getToken();
        console.log("token--->", token);
        if (token) {

        }
    }

    const subscribeListener = async () => {

        PushNotification.createChannel({
            channelId: "AzureNotification",
            channelName: "AzureNotification",
            channelDescription: "AzureNotification",
            importance: Importance.HIGH,
            vibrate: false,
            playSound: true,
        }, (created) => {
            console.log("channel created-->", created);
        })

        messaging().onTokenRefresh(async (fcmToken) => {

        })

        // forground ( when app open ) in firebase notification
        messaging().onMessage(async remoteMessage => {
            console.log("Remote message when app in foreground", remoteMessage);
            //you can display local notification here
            if (appState == "active") {
                try {
                    PushNotification.localNotification({
                        channelId: "AzureNotification",
                        title: remoteMessage.notification.title,
                        message: remoteMessage.notification.body,
                    })
                } catch (error) {
                    console.log("Error-0--->", error);
                }
            }

        })

        // Assume a message-notification contains a "type" property in the data payload of the screen to open
        messaging().onNotificationOpenedApp(remoteMessage => {
            console.log("app click", remoteMessage);
            //handle notification redirection
        });

        // executes when application is in background state.
        messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log("app setBackgroundMessageHandler", remoteMessage);

        });

        //If your app is closed
        messaging().getInitialNotification().then((notificationOpen) => {
            console.log("app getInitialNotification", notificationOpen);
            if (notificationOpen) {
                //handle notification redirection
            }
        });


        checkForIOS()

    }

    /**check config for iOS platform */
    const checkForIOS = async () => {
        if (Platform.OS == "ios") {
            await messaging().registerDeviceForRemoteMessages();
            await messaging().setAutoInitEnabled(true);
        }
    }

    return null;
}

