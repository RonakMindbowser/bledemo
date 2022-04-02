import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Alert, Linking, Button, Dimensions, Image, StatusBar
} from 'react-native';
import { deviceheight, devicewidth } from './CustomCameraMainScreen';

export default function ImageViewerScreen(props) {
    let routes = useRoute();
    let imagePath = routes.params ? routes.params.imageSource : null;
    console.log("imagepath--->", imagePath);


    React.useEffect(() => {
        submitToGoogle()
    })

    const submitToGoogle = async () => {
        try {
            // this.setState({ uploading: true });
            let image = "https://picsum.photos/200";
            let body = JSON.stringify({
                requests: [
                    {
                        features: [
                            { type: 'LABEL_DETECTION', maxResults: 10 },
                            { type: 'LANDMARK_DETECTION', maxResults: 5 },
                            { type: 'FACE_DETECTION', maxResults: 5 },
                            { type: 'LOGO_DETECTION', maxResults: 5 },
                            { type: 'TEXT_DETECTION', maxResults: 5 },
                            { type: 'DOCUMENT_TEXT_DETECTION', maxResults: 5 },
                            { type: 'SAFE_SEARCH_DETECTION', maxResults: 5 },
                            { type: 'IMAGE_PROPERTIES', maxResults: 5 },
                            { type: 'CROP_HINTS', maxResults: 5 },
                            { type: 'WEB_DETECTION', maxResults: 5 }
                        ],
                        image: {
                            source: {
                                imageUri: image
                            }
                        }
                    }
                ]
            });
            let response = await fetch(
                'https://vision.googleapis.com/v1/images:annotate?key=' +
                "AIzaSyCuQTkO9dIAwXPJYWUpg-2MMlKpFlnpiNY",
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: body
                }
            );
            let responseJson = await response.json();
            console.log(responseJson);
            // this.setState({
            //     googleResponse: responseJson,
            //     uploading: false
            // });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{"Cropped Image is given below"}</Text>
            <Image source={{ uri: imagePath }} style={{ height: deviceheight, width: devicewidth }} resizeMode='contain' />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7fbfc",
        // justifyContent: "center"
    },
    header: {
        fontSize: 14,
        color: "black",
        alignSelf: "center",
        fontWeight: "700"
    }
})
