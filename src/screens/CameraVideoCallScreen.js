import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Alert, Linking, Button, Dimensions, Image, StatusBar, FlatList, ImageBackground
} from 'react-native';
import { Camera, useCameraDevices } from "react-native-vision-camera";
import { RNCamera } from 'react-native-camera';
import images from '../assets/images/images';
import ImagePicker from 'react-native-image-crop-picker';
import { deviceheight, devicewidth } from './CustomCameraMainScreen';
import Draggable from './Draggable';

export default function CameraVideoCallScreen(props) {
    const [isCameraPermission, setCamPermission] = useState(false)
    const [isMicroPhonePermission, setMicroPermission] = useState(false)
    const cameraRef = useRef(null);
    const [isFrontMode, toggleFrontMode] = useState(false)

    const [joinedMembers, setJoinedMembers] = useState([
        {
            user_avatar: "https://picsum.photos/200/300",
            user_name: "John Max",
            user_id: 123,
            cam_type: RNCamera.Constants.Type.front,
        },
        {
            user_avatar: "https://picsum.photos/seed/picsum/200/300",
            user_name: "Peter Methew",
            user_id: 243,
            cam_type: RNCamera.Constants.Type.back,
        },
        {
            user_avatar: "https://picsum.photos/200/300",
            user_name: "Henry Sam",
            user_id: 589,
            cam_type: RNCamera.Constants.Type.front,
        },
        {
            user_avatar: "https://picsum.photos/seed/picsum/200/300",
            user_name: "Loren Hardi",
            user_id: 784,
            cam_type: RNCamera.Constants.Type.back,
        },
        {
            user_avatar: "https://picsum.photos/200/300",
            user_name: "Henry Sam",
            user_id: 589,
            cam_type: RNCamera.Constants.Type.front,
        },
        {
            user_avatar: "https://picsum.photos/seed/picsum/200/400",
            user_name: "Loren Hardi",
            user_id: 784,
            cam_type: RNCamera.Constants.Type.back,
        },
        {
            user_avatar: "https://picsum.photos/seed/picsum/200/300",
            user_name: "Henry Sam",
            user_id: 589,
            cam_type: RNCamera.Constants.Type.front,
        },
        // {
        //     user_avatar: "https://picsum.photos/200/200",
        //     user_name: "Loren Hardi",
        //     user_id: 784,
        // },
    ])

    React.useEffect(() => {
        // checkCameraPermission()
        // checkMicroPhonePermission()
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

    const renderCallItem = ({ item, index }) => {
        return (
            <ImageBackground style={{
                width: index == joinedMembers.length - 1 && (index + 1) % 2 != 0 ? devicewidth - 30 : devicewidth / 2 - 20,
                height: deviceheight / (joinedMembers.length % 2 == 0 ? joinedMembers.length / 2 : (joinedMembers.length + 1) / 2) - 10,
                marginHorizontal: 5,
                // backgroundColor: "red",
                marginTop: 5,
                // borderWidth: 1,
                borderRadius: 5
            }}
                source={{ uri: item.user_avatar }}
                imageStyle={{ borderRadius: 5 }}
            >
                {/* <RNCamera
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    type={item.cam_type}
                    style={{
                        height: "100%",
                        width: "100%",
                        overflow: "hidden"
                    }}

                    androidRecordAudioPermissionOptions={{
                        title: 'Permission to use audio recording',
                        message: 'We need your permission to use your audio',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                /> */}
                <View style={{ paddingHorizontal: 5, paddingVertical: 2, flexDirection: "row" }}>
                    <Image source={{ uri: item.user_avatar }}
                        style={{ height: 40, width: 40, borderRadius: 80 }}
                    />
                    <Text style={{ color: "black" }}>{item.user_name}</Text>
                </View>
            </ImageBackground>
        )
    }

    if (isCameraPermission && isMicroPhonePermission) {

        return (
            <View style={styles.container}>
                <FlatList
                    data={joinedMembers}
                    bounces={false}
                    numColumns={joinedMembers.length > 2 ? 2 : 1}
                    renderItem={renderCallItem}
                    contentContainerStyle={{ paddingHorizontal: 10, }}
                />
                {/* <RNCamera
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
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
                > */}



                {/* </RNCamera> */}

                <RNCamera
                    style={{
                        height: 150,
                        width: 100,
                        position: "absolute",
                        bottom: 20,
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
                <TouchableOpacity style={{
                    backgroundColor: "red", borderRadius: 50,
                    position: "absolute", padding: 10, bottom: deviceheight / 3, left: devicewidth / 2 - 25
                }}
                >
                    <Image source={images.endCallIcon} resizeMode='contain' style={{ height: 30, width: 30 }} />
                </TouchableOpacity>
                <View style={{ position: "absolute", bottom: deviceheight / 4, flexDirection: "row", justifyContent: "space-around", width: "100%" }}>
                    <TouchableOpacity style={{
                        backgroundColor: "red", borderRadius: 50,
                        padding: 10,
                    }}
                        onPress={() => { toggleFrontMode((prev) => !prev) }}
                    >
                        <Image source={images.cameraSwitchIcon} resizeMode='contain' style={{ height: 30, width: 30 }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        backgroundColor: "red", borderRadius: 50,
                        padding: 10,
                    }}>
                        <Image source={images.microphone} resizeMode='contain' style={{ height: 30, width: 30 }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        backgroundColor: "red", borderRadius: 50,
                        padding: 10,
                    }}>
                        <Image source={images.turnOffVideo} resizeMode='contain' style={{ height: 30, width: 30 }} />
                    </TouchableOpacity>
                </View>
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