import React, { useRef, useState } from 'react';
import { Button, StyleSheet, Text, View, Image, ScrollView, Platform, NativeModules } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
// import ProgressCircle from 'react-native-progress/Circle';
import TesseractOcr, {
    LANG_ENGLISH,
    useEventListener,
} from 'react-native-tesseract-ocr';
import RNTextDetector from "rn-text-detector";
import PSPDFKitView from 'react-native-pspdfkit';
const PSPDFKit = NativeModules.PSPDFKit;

const DEFAULT_HEIGHT = 500;
const DEFAULT_WITH = 600;
const defaultPickerOptions = {
    cropping: false,
    height: DEFAULT_HEIGHT,
    width: DEFAULT_WITH,
};

function TextOCRScreen() {
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [imgSrc, setImgSrc] = useState(null);
    const [text, setText] = useState('');
    // useEventListener('onProgressChange', (p) => {
    //     setProgress(p.percent / 100);
    // });
    const pdfRef = useRef();
    const recognizeTextFromImage = async (path) => {
        setIsLoading(true);

        //* This is based on react-native-tesseract-ocr
        // try {
        //     const tesseractOptions = {};
        //     const recognizedText = await TesseractOcr.recognize(
        //         path,
        //         LANG_ENGLISH,
        //         tesseractOptions,
        //     );
        //     console.log("recognizedTextrecognizedText--->", recognizedText);
        //     setText(recognizedText);
        // } catch (err) {
        //     console.error(err);
        //     setText('');
        // }

        //* This is based on rn-text-detector

        // const options = {
        //     quality: 0.8,
        //     base64: true,
        //     skipProcessing: true,
        //   };
        //   const { uri } = await this.camera.takePictureAsync(options);
        const visionResp = await RNTextDetector.detectFromUri(path);
        console.log('visionResp', visionResp);
        if (visionResp.length) {
            alert("success")

            let stringFromArray = visionResp.map((obj) => obj.text).toString(" ")
            console.log('stringFromArray', stringFromArray);
            setIsLoading(false);
            setText(stringFromArray);
        }

        setIsLoading(false);
        setProgress(0);
    };

    const recognizeFromPicker = async (options = defaultPickerOptions) => {
        // try {
        //     const image = await ImagePicker.openPicker({
        //         ...options,
        //         freeStyleCropEnabled: true,

        //     });
        //     setImgSrc({ uri: image.path });
        //     await recognizeTextFromImage(image.path);
        // } catch (err) {
        //     if (err.message !== 'User cancelled image selection') {
        //         console.error(err);
        //     }
        // }
        let annotations = await pdfRef.current.getAnnotations(0, 'all');
        console.log("Annotations----->", annotations);
        let givenNameValue = await pdfRef.current.getFormFieldValue('Given Name Text Box');
        console.log("givenNameValue----->", givenNameValue);
        let familyNameValue = await pdfRef.current.getFormFieldValue("Family Name Text Box");
        console.log("familyNameValue----->", familyNameValue);
    };

    const recognizeFromCamera = async (options = defaultPickerOptions) => {
        try {
            const image = await ImagePicker.openCamera(options);
            setImgSrc({ uri: image.path });
            await recognizeTextFromImage(image.path);
        } catch (err) {
            if (err.message !== 'User cancelled image selection') {
                console.error(err);
            }
        }
    };
    const DOCUMENT =
        Platform.OS === 'ios' ? 'Document.pdf' : "file:///android_asset/OoPdfFilledFormExample.pdf";
    Platform.OS === 'ios' ? 'Document.pdf' : "file:///android_asset/OoPdfFormExample.pdf";
    // Platform.OS === 'ios' ? 'Document.pdf' : "file:///android_asset/Document.pdf";
    console.log("image src-->", imgSrc);
    // PSPDFKit.presentImage(DOCUMENT, {});
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingVertical: 20 }}>
            <View style={styles.container}>
                <Text style={styles.title}>Tesseract OCR example</Text>
                <Text style={styles.instructions}>Select an image source:</Text>
                <View style={styles.options}>
                    <View style={styles.button}>
                        <Button
                            disabled={isLoading}
                            title="Camera"
                            onPress={() => {
                                recognizeFromCamera();
                            }}
                        />
                    </View>
                    <View style={styles.button}>
                        <Button
                            disabled={isLoading}
                            title="Picker"
                            onPress={() => {
                                recognizeFromPicker();
                            }}
                        />
                    </View>
                </View>
                {/* {imgSrc && (
                    <View style={styles.imageContainer}>
                        <Image style={styles.image} source={imgSrc} resizeMode='contain' />

                        <Text style={{ color: "black", fontSize: 16 }}>{text}</Text>
                    </View>
                )} */}
                <View style={{ height: 400, width: "100%", overflow: "hidden" }}>
                    <PSPDFKitView
                        document={DOCUMENT}
                        configuration={{
                            showThumbnailBar: 'scrollable',
                            pageTransition: 'scrollContinuous',
                            scrollDirection: 'vertical',
                            enableFormEditing: false, //To disable form editing and interaction for your document, you can set the enableFormEditing configuration option to false
                        }}
                        ref={pdfRef}
                        fragmentTag="PDF1"
                        style={{ height: 400, width: "100%", margin: 10, overflow: "hidden" }}
                    />
                </View>
            </View>
        </ScrollView>
    );
    // <PSPDFKitView
    //     document={DOCUMENT}
    //     configuration={{
    //         showThumbnailBar: 'scrollable',
    //         pageTransition: 'scrollContinuous',
    //         scrollDirection: 'vertical',
    //     }}
    //     ref={pdfRef}
    //     fragmentTag="PDF1"
    //     style={{ flex: 1 }}
    // />
    // )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    options: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
    button: {
        marginHorizontal: 10,
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        marginVertical: 15,
        height: DEFAULT_HEIGHT / 2.5,
        width: DEFAULT_WITH / 2.5,
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

export default TextOCRScreen;