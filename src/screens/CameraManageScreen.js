import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Alert, Linking, Button, Dimensions, Image, StatusBar
} from 'react-native';

export default function CameraManageScreen(props) {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button}
                onPress={() => navigation.navigate("CustomCameraMainScreen")}
            >
                <Text style={styles.textInput}>
                    {"Camera with simple custom button"}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}
                onPress={() => navigation.navigate("CameraVideoCallScreen")}
            >
                <Text style={styles.textInput}>
                    {"Camera with Group Video call"}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}
                onPress={() => navigation.navigate("VideoCameraScreen")}
            >
                <Text style={styles.textInput}>
                    {"Camera with 1-1 Video call"}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}
                onPress={() => navigation.navigate("MainScreen")}
            >
                <Text style={styles.textInput}>
                    {"HooksDemo"}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}
                onPress={() => navigation.navigate("FirebaseMainScreen")}
            >
                <Text style={styles.textInput}>
                    {"Firebase cloud functions"}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}
                onPress={() => navigation.navigate("BluetoothMainScreen")}
            >
                <Text style={styles.textInput}>
                    {"BLE-Bluetooth work using blemanager"}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}
                onPress={() => navigation.navigate("BluetoothBlePlx")}
            >
                <Text style={styles.textInput}>
                    {"BLE-Bluetooth work using plepx"}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}
                onPress={() => navigation.navigate("RNPushNotification")}
            >
                <Text style={styles.textInput}>
                    {"Azure+Fcm push notification"}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}
                onPress={() => navigation.navigate("TextOCRScreen")}
            >
                <Text style={styles.textInput}>
                    {"Text Recognization"}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}
                onPress={() => navigation.navigate("ReusbleComponentDemo")}
            >
                <Text style={styles.textInput}>
                    {"Reusble Component Demo"}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7fbfc",
        justifyContent: "center"
    },
    textInput: {
        color: "white",
        fontSize: 14
    },
    button: {
        backgroundColor: "red",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        marginHorizontal: 20,
        marginVertical: 10
    }
})