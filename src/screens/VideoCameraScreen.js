import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Alert, Linking, Button, Dimensions, Image, StatusBar, FlatList, ImageBackground
} from 'react-native';
// import { Camera, useCameraDevices } from "react-native-vision-camera";
import { RNCamera } from 'react-native-camera';
import images from '../assets/images/images';
import ImagePicker from 'react-native-image-crop-picker';
import { deviceheight, devicewidth } from './CustomCameraMainScreen';
import StopWatch from '../stopwatchtimer/Stopwatch';

export default function VideoCameraScreen(props) {
    const [isCameraPermission, setCamPermission] = useState(false)
    const [isMicroPhonePermission, setMicroPermission] = useState(false)
    const cameraRef = useRef(null);
    const [isFrontMode, toggleFrontMode] = useState(false)
    const [stopwatchStart, setStopwatchStart] = useState(false)
    const [stopwatchReset, setStopwatchReset] = useState(false)

    React.useEffect(() => {
        // checkCameraPermission()
        // checkMicroPhonePermission()
        setStopwatchStart(true)
    }, [])

    const checkCameraPermission = async () => {
        const cameraPermission = await Camera.getCameraPermissionStatus()
        // const microphonePermission = await Camera.getMicrophonePermissionStatus()
        console.log("cameraPermission--->", cameraPermission);
        if (cameraPermission == "authorized") {
            setCamPermission(true)
        }
        else if (cameraPermission == "not-determined") {
            const newCameraPermission = await Camera.requestCameraPermission()
            if (newCameraPermission == "authorized") {
                setCamPermission(true)
            }
            else if (newCameraPermission == "denied") {
                handleCameraDeniedPermission()
            }
        }
        else if (cameraPermission == "denied") {
            // handleCameraDeniedPermission()
            const newCameraPermission = await Camera.requestCameraPermission()
            if (newCameraPermission == "authorized") {
                setCamPermission(true)
            }
            else if (newCameraPermission == "denied") {
                handleCameraDeniedPermission()
            }
        }
        else if (cameraPermission == "restricted") {
            // handleCameraDeniedPermission()
            Alert.alert("CustomCameraDemo", "Camera Permission is restricted by you , so please enable it from settings")
            setCamPermission(false)
        }

    }
    const handleCameraDeniedPermission = () => {
        Alert.alert("CustomCameraDemo",
            "You have denied for camera permission, so please go to setting and enable it",
            [
                {
                    text: "Cancel",
                    onPress: () => null
                },
                {
                    text: "Okay",
                    onPress: () => {
                        Linking.openSettings();
                    }
                }
            ]
        )
    }

    const checkMicroPhonePermission = async () => {
        console.log("check for it");
        const cameraPermission = await Camera.getMicrophonePermissionStatus()
        // const microphonePermission = await Camera.getMicrophonePermissionStatus()
        console.log("microPhone--->", cameraPermission);
        if (cameraPermission == "authorized") {
            setMicroPermission(true)
        }
        else if (cameraPermission == "not-determined") {
            const newCameraPermission = await Camera.requestMicrophonePermission()
            if (newCameraPermission == "authorized") {
                setMicroPermission(true)
            }
            else if (newCameraPermission == "denied") {
                handleMicroDeniedPermission()
            }
        }
        else if (cameraPermission == "denied") {
            // handleMicroDeniedPermission()
            const newCameraPermission = await Camera.requestMicrophonePermission()
            if (newCameraPermission == "authorized") {
                setMicroPermission(true)
            }
            else if (newCameraPermission == "denied") {
                handleMicroDeniedPermission()
            }
        }
        else if (cameraPermission == "restricted") {
            // handleCameraDeniedPermission()
            Alert.alert("CustomCameraDemo", "Microphone Permission is restricted by you , so please enable it from settings")
            setMicroPermission(false)
        }

    }

    const handleMicroDeniedPermission = () => {
        Alert.alert("CustomCameraDemo",
            "You have denied for microphone permission, so please go to setting and enable it",
            [
                {
                    text: "Cancel",
                    onPress: () => null
                },
                {
                    text: "Okay",
                    onPress: () => {
                        Linking.openSettings();
                    }
                }
            ]
        )
    }
    const options = {
        container: {
            alignSelf: "center",
            marginTop: 10
        },
        text: {
            color: "white",
            fontSize: 16,
        }

    }

    const getFormattedTime = (time) => {
        console.log("Time--->", time);
    }

    if (isCameraPermission && isMicroPhonePermission) {
        return (
            <View style={styles.container}>
                <ImageBackground source={{ uri: "https://picsum.photos/200/300" }}
                    style={{ height: deviceheight, width: devicewidth }}
                >
                    <StopWatch laps msecs={false} start={stopwatchStart}
                        reset={stopwatchReset}
                        options={options}
                        getTime={getFormattedTime} />
                    <RNCamera
                        style={{
                            height: 150,
                            width: 100,
                            position: "absolute",
                            top: 20,
                            // bottom: 20,
                            right: 20
                        }}
                        // type={RNCamera.Constants.Type.front}
                        type={isFrontMode ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back}
                        flashMode={RNCamera.Constants.FlashMode.on}
                        androidCameraPermissionOptions={{
                            title: 'Permission to use camera',
                            message: 'We need your permission to use your camera',
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancel',
                        }}
                        androidRecordAudioPermissionOptions={{
                            title: 'Permission to use audio recording',
                            message: 'We need your permission to use your audio',
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancel',
                        }}
                    />
                    <View style={{
                        position: "absolute", bottom: 50,
                        flexDirection: "row",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        alignSelf: "center",
                        width: "80%",
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                        alignItems: "center",
                        justifyContent: "space-around",
                        borderRadius: 10
                    }}>
                        <TouchableOpacity style={{
                        }}
                        >
                            <Image source={images.endCallIcon} resizeMode='contain' style={{ height: 30, width: 30 }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                        }}
                            onPress={() => { toggleFrontMode((prev) => !prev) }}
                        >
                            <Image source={images.cameraSwitchIcon} resizeMode='contain' style={{ height: 30, width: 30 }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                        }}>
                            <Image source={images.microphone} resizeMode='contain' style={{ height: 30, width: 30 }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                        }}>
                            <Image source={images.turnOffVideo} resizeMode='contain' style={{ height: 30, width: 30 }} />
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </View>
        )
    }
    else {
        return (
            <View style={[styles.container, { justifyContent: "center" }]}>
                <Text>{"Permission is not available , click on button below to grant permission"}</Text>
                <Button title='Get Permission' onPress={() => {
                    checkCameraPermission()
                    checkMicroPhonePermission()
                }} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7fbfc",
        // justifyContent: "center"
    },
    textInput: {
        color: "black",
    },
    button: {
        backgroundColor: "red",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        marginHorizontal: 20,
        marginVertical: 10
    },
    preview: {
        flex: 1,
        height: deviceheight,
        width: devicewidth
    },
    capture: {
        height: 60,
        width: 60,
        borderWidth: 2,
        borderColor: "white",
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
    },
    innerClick: {
        height: "80%",
        width: "80%",
        backgroundColor: "white",
        margin: 20,
        borderRadius: 100
    }
})