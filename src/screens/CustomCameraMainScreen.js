import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Alert, Linking, Button, Dimensions, Image, StatusBar
} from 'react-native';
import { Camera, useCameraDevices } from "react-native-vision-camera";
import { RNCamera } from 'react-native-camera';
import images from '../assets/images/images';
import ImagePicker from 'react-native-image-crop-picker';

export const deviceheight = Dimensions.get("window").height
export const devicewidth = Dimensions.get("window").width;


export default function CustomCameraMainScreen(props) {

    const [isCameraPermission, setCamPermission] = useState(false)
    const [isMicroPhonePermission, setMicroPermission] = useState(false)
    const [isFlashOn, toggleFlash] = useState(false)
    const [isFrontMode, toggleFrontMode] = useState(false)
    const [photoClicked, toggleClicked] = useState(false);
    const [imagePath, setImagePath] = useState("");
    const cameraRef = useRef(null);
    const navigation = useNavigation();


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
    const takePicture = async () => {
        if (cameraRef) {
            const options = { quality: 0.5, base64: true };
            const data = await cameraRef.current.takePictureAsync(options);
            console.log(data);
            cameraRef.current.pausePreview()
            setImagePath(data.uri)
            toggleClicked((prev) => !prev)
            // ImagePicker.openCropper({
            //     path: data.uri,
            // }).then(image => {
            //     console.log(image);
            // });
            // cameraRef.current.pausePreview()
        }
    };
    // const devices = useCameraDevices()
    // const device = devices.back
    // const devices = await Camera.getAvailableCameraDevices();

    // const devices = useCameraDevices()
    // const device = devices.back
    // const isFocused = useIsFocused()
    // console.log("device---->", device);
    if (isCameraPermission && isMicroPhonePermission) {

        return (
            <View style={styles.container}>
                {/* <StatusBar hidden showHideTransition='fade' translucent  /> */}
                {/* {
                    isCameraPermission ?
                        <Camera
                            style={StyleSheet.absoluteFill}
                            device={device}
                            isActive={true}
                        />
                        : null
                } */}
                {/* <Camera
                    style={StyleSheet.absoluteFill}
                    device={device}
                    isActive={isFocused}
                    video={false}
                    preset='medium'
                    frameProcessorFps={1}
                    onError={(error) => {
                        console.log("Error-cam-->", error)
                    }}
                /> */
                }

                <RNCamera
                    ref={cameraRef}
                    style={styles.preview}
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
                // onTextRecognized={(response) => {
                //     console.log("Respons-text recognization-->", response)
                // }}
                >
                    <View style={{
                        flex: 1,
                        justifyContent: "flex-end",
                        paddingBottom: 20
                    }}>
                        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center', alignItems: "center" }}>
                            {
                                photoClicked ?
                                    <>
                                        <TouchableOpacity style={styles.capture} onPress={() => {
                                            cameraRef.current.resumePreview()
                                            setImagePath(null)
                                            toggleClicked((prev) => !prev)
                                        }}>
                                            <Image source={images.closeIcon} />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.capture, { marginHorizontal: 10 }]} onPress={() => {

                                            ImagePicker.openCropper({
                                                path: imagePath
                                            }).then((image) => {
                                                cameraRef.current.resumePreview()
                                                toggleClicked((prev) => !prev)
                                                navigation.navigate("ImageViewerScreen", { imageSource: image.path })
                                            }).catch((error) => {
                                                console.log("image crop error---->", error)
                                            })

                                        }}>
                                            <Image source={images.approvedIcon} />
                                        </TouchableOpacity>
                                    </>
                                    :
                                    <>
                                        <TouchableOpacity onPress={takePicture} style={styles.capture}>
                                            <View style={styles.innerClick} />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() => { toggleFrontMode((prev) => !prev) }}
                                            style={[styles.capture, { marginLeft: 10 }]}
                                        >
                                            <Image source={images.cameraSwitchIcon} />
                                        </TouchableOpacity>
                                    </>
                            }
                        </View>
                    </View>
                </RNCamera>
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