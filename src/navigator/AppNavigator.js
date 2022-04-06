import React, { } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MainScreen from "../screens/MainScreen";
import ScreenA from "../screens/ScreenA";
import ScreenB from "../screens/ScreenB";
import ScreenC from "../screens/ScreenC";
import ScreenD from "../screens/ScreenD";
import ScreenE from "../screens/ScreenE";
import BluetoothMainScreen from "../screens/BluetoothMainScreen";
import FirebaseMainScreen from "../screens/FirebaseMainScreen";
import CustomCameraMainScreen from "../screens/CustomCameraMainScreen";
import ImageViewerScreen from "../screens/ImageViewerScreen";
import CameraManageScreen from "../screens/CameraManageScreen";
import CameraVideoCallScreen from "../screens/CameraVideoCallScreen";
import VideoCameraScreen from "../screens/VideoCameraScreen";
import BluetoothBlePlx from "../screens/BluetoothBlePlx";
import RNPushNotification from "../screens/RNPushNotification";
import TextOCRScreen from "../screens/TextOCRScreen";
import HandleShareComponent from "../screens/HandleShareComponent";
import { navigationRef } from "./NavigationService";
import ReusbleComponentDemo from "../screens/ReusbleComponentDemo";
import BluetoothModule from "../screens/BluetoothModule";
import BLEDeviceService from "../screens/BLEDeviceService";

const Stack = createStackNavigator();

function AppContainer() {
    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="BluetoothModule" component={BluetoothModule} />
                <Stack.Screen name="CameraManageScreen" component={CameraManageScreen} />
                <Stack.Screen name="CustomCameraMainScreen" component={CustomCameraMainScreen} />
                <Stack.Screen name="CameraVideoCallScreen" component={CameraVideoCallScreen} />
                <Stack.Screen name="VideoCameraScreen" component={VideoCameraScreen} />
                <Stack.Screen name="ImageViewerScreen" component={ImageViewerScreen} />
                <Stack.Screen name="BluetoothMainScreen" component={BluetoothMainScreen} />
                <Stack.Screen name="FirebaseMainScreen" component={FirebaseMainScreen} />
                <Stack.Screen name="BluetoothBlePlx" component={BluetoothBlePlx} />
                <Stack.Screen name="TextOCRScreen" component={TextOCRScreen} />
                {/* <Stack.Screen name="RNPushNotification" component={RNPushNotification} /> */}
                <Stack.Screen name="MainScreen" component={MainScreen} />
                <Stack.Screen name="ScreenA" component={ScreenA} />
                <Stack.Screen name="ScreenB" component={ScreenB} />
                <Stack.Screen name="ScreenC" component={ScreenC} />
                <Stack.Screen name="ScreenD" component={ScreenD} />
                <Stack.Screen name="ScreenE" component={ScreenE} />
                <Stack.Screen name="HandleShareComponent" component={HandleShareComponent} />
                <Stack.Screen name="ReusbleComponentDemo" component={ReusbleComponentDemo} />
                <Stack.Screen name="BLEDeviceService" component={BLEDeviceService} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppContainer;
