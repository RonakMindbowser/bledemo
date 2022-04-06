import React, {
    useState,
    useEffect,
} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    NativeModules,
    NativeEventEmitter,
    Button,
    Platform,
    PermissionsAndroid,
    FlatList,
    TouchableHighlight,
    TextInput,
    TouchableOpacity,
    Switch,
    RefreshControl,
    Image,
    Modal,
    ActivityIndicator,
    ToastAndroid,
} from 'react-native';

import {
    Colors,
} from 'react-native/Libraries/NewAppScreen';
import BleManager from "react-native-ble-manager";
import { stringToBytes, bytesToString } from "convert-string";
import { ColorPicker, toHsv, fromHsv, TriangleColorPicker } from 'react-native-color-picker';
import { hexToRgb, HSLToHex, hslToHex, hsv2rgb, HSVtoRGB } from '../Utils';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
var Buffer = require('buffer/').Buffer  // note: the trailing slash is important!

import { CustomHeader, CustomLoader } from "react-native-reusable-custom-components";
import images from '../assets/images/images';
import { useNavigation, useRoute } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { colorAndShadeList, colorAndShadeList1 } from './ColorList';

const BLEDeviceService = (props) => {
    const navigation = useNavigation();
    const route = useRoute();

    const [currentIndex, setIndex] = useState(0)
    const [randomNumber, setRandom] = useState(Date.now())

    const [lastColor, setLastColor] = useState("");
    const [serviceAndCharList, setServiceAndCharList] = useState([]);
    const [isServiceAndCharAvailable, setAvaibility] = useState(false);
    const [selectedColorFromPicker, setPickerColor] = useState("#FF0000");
    const [isEnabled, setEnabled] = useState(true)

    const serviceUUIDForWriteBlubColor = "ffb0"
    const characteristicUUIDForWriteBlubColor = "ffb2"
    const characteristicUUIDForChangeNameBlubColor = "ffb7"
    const fullBrightNessHexValue = 49; // 1
    const zeroBrightNessHexValue = 48; // 0

    const colorAndShadeList = colorAndShadeList1

    useEffect(() => {

        // const ble1 = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
        // const ble2 = bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
        const ble3 = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral);
        const ble4 = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);

        getAllServiceForBLEDevice()

        return (() => {
            console.log('unmount');
            // ble1.remove()
            // ble2.remove()
            // ble3.remove()
            ble4.remove()
        })

    }, []);

    const handleDisconnectedPeripheral = (data) => {
        console.log('Disconnected from ' + JSON.stringify(data));
        alert("BLE Device is Disconnected")
        navigation.goBack()
    }

    const getAllServiceForBLEDevice = () => {
        let item = route.params && route.params.peripheral ? route.params.peripheral : null
        var tempdata = [];
        BleManager.retrieveServices(item.id).then((res1) => {
            console.log("Res1===>", res1);
            let data = res1.characteristics;
            var seen = {};
            tempdata = data.filter(function (entry) {
                var previous;

                // Have we seen this service before?
                if (seen.hasOwnProperty(entry.service)) {
                    // Yes, grab it and add this data to it
                    previous = seen[entry.service];
                    previous.characteristicList.push({
                        characteristic: entry.characteristic,
                        properties: entry.properties,
                    });

                    // Don't keep this entry, we've merged it into the previous one
                    return false;
                }

                // entry.data probably isn't an array; make it one for consistency
                if (!Array.isArray(entry.characteristicList)) {
                    entry.characteristicList = [{
                        characteristic: entry.characteristic,
                        properties: entry.properties,
                    }];
                }

                // Remember that we've seen it
                seen[entry.service] = entry;
                delete entry.characteristic;
                delete entry.properties;
                delete entry.descriptors;
                // Keep this one, we'll merge any others that match into it
                return true;
            });
            console.log("tempdata-0----->", tempdata);
            setServiceAndCharList(tempdata)
            let isListContainBlubChangeColorService = tempdata.filter((obj) => obj.service == serviceUUIDForWriteBlubColor);
            console.log("isListContainBlubChangeColorService---->", isListContainBlubChangeColorService);

            if (isListContainBlubChangeColorService.length > 0) {
                let isListContainBlubChangeColorChar = isListContainBlubChangeColorService[0].characteristicList.filter((obj) => obj.characteristic == characteristicUUIDForWriteBlubColor);
                console.log("isListContainBlubChangeColorChar---->", isListContainBlubChangeColorChar);
                if (isListContainBlubChangeColorChar.length) {
                    setAvaibility(true)
                }
                else {
                    setAvaibility(false)
                }
            }
            else {
                setAvaibility(false)
            }

            // function getCharCodes(s) {
            //     let charCodeArr = [];

            //     for (let i = 0; i < s.length; i++) {
            //         let code = s.charCodeAt(i);
            //         charCodeArr.push(code);
            //     }

            //     return charCodeArr;
            // }

            // let yourStringData = "New Device"
            // const data11 = getCharCodes(yourStringData);
            // console.log("Data11000<", data11);
            // BleManager.write(item.id, serviceUUIDForWriteBlubColor, characteristicUUIDForChangeNameBlubColor, [65, 66]).then((characteristic) => {
            //     console.log("characteristic--->", characteristic);

            //     // const bytesString = String.fromCharCode(...characteristic)
            //     // console.log('Bytes to string: ', bytesString)

            //     // let bytesView = new Uint8Array(characteristic);
            //     // console.log(bytesView);
            //     // let str = new TextDecoder().decode(bytesView);
            //     // console.log(str);


            // }).catch((error) => {
            //     console.log("Error--->", error);
            // })

            // let newList = list;
            // newList[index].servicesList = tempdata;
            // newList[index].isEnabled = true;
            // setRandom(Date.now())
            // setList(newList);
        }).catch((err) => {
            console.log("err-->", err);
        })
    }

    const handleUpdateValueForCharacteristic = (data) => {
        console.log("Data---->Received--->", data);
    }

    const renderColorTitleItem = (item, index) => {
        // const renderColorTitleItem = ({ item, index }) => {
        return (
            <TouchableOpacity style={styles.titleView}
                onPress={() => {
                    setIndex(index)
                }}
            >
                <Text style={styles.title}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    const renderColorItem = ({ item, index }) => {
        return (
            <TouchableOpacity style={{
                borderWidth: 0.5,
                flexDirection: "row",
                paddingVertical: 10,
                paddingHorizontal: 10,
                alignItems: "center",
                marginVertical: 5
            }}
                onPress={() => {
                    applyConversion(item.backgroundColor)
                }}
            >
                <View style={{
                    backgroundColor: item.backgroundColor,
                    height: 30, width: 30,
                    borderRadius: 30 * 2,
                    borderWidth: 2,
                    elevation: 5,
                    marginHorizontal: 10
                }} />
                <Text style={styles.colorName}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    const applyConversion = (color) => {

        if (isServiceAndCharAvailable) {
            let item = route.params && route.params.peripheral ? route.params.peripheral : null
            console.log("color--->", color)
            let hexToRgbValue = hexToRgb(color)
            console.log("hexToRgbValue--->", hexToRgbValue)
            let { r, g, b } = hexToRgbValue
            let tempObj = {
                id: item.id,
                name: item.name,
                service: serviceUUIDForWriteBlubColor,
                characteristic: characteristicUUIDForWriteBlubColor,
                writeValueData: [fullBrightNessHexValue, r, g, b]
                // writeValueData: [fullBrightNessHexValue, r, g, b]
            }
            setLastColor(color)
            readAndWriteData(tempObj)
        }
        else {
            ToastAndroid.show("Blub change color service is not available.", ToastAndroid.SHORT)
        }
    }

    const readAndWriteData = (peripheral, isRead, isToggleBlub) => {
        console.log("peripheral======>", peripheral);

        BleManager.isPeripheralConnected(peripheral.id, []).then((res) => {
            console.log(`${peripheral.name} is connected???`, res);

            if (res == false) {
                console.log("******not connected so going to connect...........");
                BleManager.connect(peripheral.id)
                    .then((res7) => {
                        // Success code
                        console.log("connect started", res7);
                        if (isRead) readCharData(peripheral)
                        else writeCharData(peripheral, isToggleBlub)
                    })
                    .catch((error) => { console.log("error---456464454->", error); });
            }
            else {
                if (isRead) readCharData(peripheral)
                else writeCharData(peripheral, isToggleBlub)
            }
        }).catch((error) => { console.log("Error--->", error) })
    }

    const readCharData = (peripheral) => {
        setBleValue("")
        BleManager.read(peripheral.id, peripheral.service, peripheral.characteristic).then((characteristic) => {
            console.log("Readable char ------<>", characteristic);
            // const bytesString = String.fromCharCode.apply(String, characteristic) //same as below
            const bytesString = String.fromCharCode(...characteristic)
            console.log('Bytes to string: ', bytesString)

            let bytesView = new Uint8Array(characteristic);
            console.log(bytesView);
            let str = new TextDecoder().decode(bytesView);
            console.log(str);

            setBleValue(bytesString)
        }).catch((error) => {
            console.log("error--read error-->", error);
        });
    }

    const writeCharData = (peripheral, isToggleBlub) => {

        try {
            BleManager.write(peripheral.id,
                peripheral.service,
                peripheral.characteristic,
                peripheral.writeValueData	// [48, 0, 0, 0]	//	tempBuffer
            ).then((response) => {
                console.log("Resonse---->", response);
                if (isToggleBlub == "1") {
                    ToastAndroid.show("Blub is now Turned On", ToastAndroid.SHORT)
                }
                else if (isToggleBlub == "2") {
                    ToastAndroid.show("Blub is now Turned Off", ToastAndroid.SHORT)
                }
                else {

                }
            }).catch(error => {
                console.log("Error--->", error);
            })
        } catch (error) {
            console.log("Error---123123123-<", error);
        }
    }

    const onBrightnessChange = (value) => {
        console.log("onBrightnessChange----->", value);


    }

    const handleBlubToggleValue = (value,) => {
        console.log("value,item,index-->", value);
        console.log("Last color,item,index-->", lastColor);
        let item = route.params && route.params.peripheral ? route.params.peripheral : null

        if (value) {
            let hexToRgbValue = hexToRgb(lastColor ? lastColor : "#FFFFFF")
            console.log("hexToRgbValue--->", hexToRgbValue)
            let { r, g, b } = hexToRgbValue

            let tempObj = {
                id: item.id,
                name: item.name,
                service: serviceUUIDForWriteBlubColor,
                characteristic: characteristicUUIDForWriteBlubColor,
                writeValueData: [fullBrightNessHexValue, r, g, b]
                // writeValueData: [fullBrightNessHexValue, 255, 255, 255]
            }
            readAndWriteData(tempObj, false, "1")
        }
        else {
            let tempObj = {
                id: item.id,
                name: item.name,
                service: serviceUUIDForWriteBlubColor,
                characteristic: characteristicUUIDForWriteBlubColor,
                writeValueData: [zeroBrightNessHexValue, 0, 0, 0]
            }
            readAndWriteData(tempObj, false, "2")
        }
        setEnabled(value)
    }

    return (
        <View style={styles.container}>
            <CustomHeader
                backButton
                middleText='BLE Device Services'
                onBackButtonPress={() => navigation.goBack()}
            />

            <ScrollView
                horizontal
                contentContainerStyle={{ paddingTop: 20, }}
            >
                {colorAndShadeList.map((item, index) => renderColorTitleItem(item, index))}
            </ScrollView>

            {/* <FlatList
                data={colorAndShadeList}
                extraData={colorAndShadeList}
                horizontal
                keyExtractor={(i, j) => j.toString()}
                renderItem={renderColorTitleItem}
                contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 30 }}
            /> */}

            {currentIndex != 0 ? <FlatList
                data={colorAndShadeList[currentIndex].colorList}
                extraData={randomNumber}
                renderItem={renderColorItem}
                contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 10, height: "60%" }}
            /> :
                <View style={{ height: "70%", marginBottom: 30 }}>
                    <ColorPicker
                        onColorSelected={color => {
                            applyConversion(color)
                        }}
                        style={{ flex: 1 }}
                        hideControls
                        hideSliders
                        onColorChange={selectedColor => {
                            let temp2 = fromHsv({
                                h: selectedColor.h,
                                s: selectedColor.s,
                                v: selectedColor.v
                            })
                            setPickerColor(temp2)
                        }}
                    />
                    <TouchableOpacity
                        onPress={() => {
                            applyConversion(selectedColorFromPicker)
                        }}
                        style={[styles.titleView, { width: 200, alignSelf: "center" }]}
                    >
                        <Text style={styles.title}>{"Select"}</Text>
                    </TouchableOpacity>
                </View>
            }
            {/* <Text style={{ fontSize: 16, color: "black" }}>{"Brightness"}</Text>
            <Slider
                style={{ width: "90%", height: 60, marginLeft: "5%" }}
                minimumValue={0}
                maximumValue={1}
                thumbTintColor='red'
                step={0.1}
                minimumTrackTintColor="black"
                maximumTrackTintColor="blue"
                onValueChange={onBrightnessChange}
            /> */}
            <View style={{
                position: "absolute",
                right: 0,
                top: 20
            }}>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={(value) => handleBlubToggleValue(value)}
                    value={isEnabled}
                />
            </View>
        </View>
    )
}

export default BLEDeviceService;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    titleView: {
        borderWidth: 1,
        backgroundColor: "blue",
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 10,
        paddingHorizontal: 10,
        borderRadius: 10
    },
    title: {
        color: "white",
        fontSize: 14,
    },
    colorName: {
        color: "black",
    }
})