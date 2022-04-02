/**
 * Sample BLE React Native BletoothMainScreen
 *
 * @format
 * @flow strict-local
 */

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
} from 'react-native';

import {
    Colors,
} from 'react-native/Libraries/NewAppScreen';
import BleManager from "react-native-ble-manager";
import { stringToBytes, bytesToString } from "convert-string";

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
var Buffer = require('buffer/').Buffer  // note: the trailing slash is important!

const BletoothMainScreen = () => {

    const [isScanning, setIsScanning] = useState(false);
    const [message, setMessage] = useState("");
    const [hexValue, setHexValue] = useState("");
    const [readValueFromBLE, setBleValue] = useState("");
    const [notifyValueFromBLE, setNotifyValue] = useState("");
    const peripherals = new Map();
    const [list, setList] = useState([]);
    const [randomNumber, setRandom] = useState(Date.now())
    const [isBluetoothStarted, setBluetoothtoggle] = React.useState(false);

    const startScan = () => {
        if (!isScanning) {
            BleManager.scan([], 10, true).then((results) => {
                console.log('Scanning...');
                setIsScanning(true);
            }).catch(err => {
                console.error(err);
            });
        }
    }

    const handleStopScan = () => {
        console.log('Scan is stopped');
        setIsScanning(false);
    }

    const handleDisconnectedPeripheral = (data) => {
        let peripheral = peripherals.get(data.peripheral);
        if (peripheral) {
            peripheral.connected = false;
            peripherals.set(peripheral.id, peripheral);
            setList(Array.from(peripherals.values()));
        }
        console.log('Disconnected from ' + JSON.stringify(data));
    }

    const handleUpdateValueForCharacteristic = (data) => {
        setNotifyValue("")
        console.log("Data---->Received--->", data);
        const converteddata = bytesToString(data.value);
        console.log("converteddata---->Received--->", converteddata);
        console.log(`Recieved ${converteddata} for characteristic ${data.characteristic}`);

        function bytesToWritableArray(bytes) {
            let value = [];
            for (let index = 0; index < bytes.length; index++) {
                value.push(parseInt(bytes[index], 8))
            }
            return value;
        }

        var arr = bytesToWritableArray(data.dataValue);

        function bin2String(array) {
            var result = "";
            for (var i = 0; i < array.length; i++) {
                result += String.fromCharCode(parseInt(array[i], 2));
            }
            return result;
        }


        let temp2 = bin2String(["01100110", "01101111", "01101111"]); // "foo"
        // let temp2 = bin2String(data.value);

        let bytesView = new Uint8Array(data.value);
        console.log(bytesView);
        let str = new TextDecoder().decode(bytesView);
        console.log(str);
        setNotifyValue(str)

        alert("successfully read: " + str)
    }

    const enableBluetoothInDevice = () => {
        BleManager.enableBluetooth()
            .then(() => {
                // Success code
                console.log("The bluetooth is already enabled or the user confirm");
                setBluetoothtoggle(true)
            })
            .catch((error) => {
                console.log("rror-r---->", error);
                // Failure code
            });
    }

    const retrieveConnected = () => {

        BleManager.getDiscoveredPeripherals([]).then((results) => {
            console.log("Res of discover--->", results);
            for (var i = 0; i < results.length; i++) {
                var peripheral = results[i];
                peripheral.connected = true;
                peripherals.set(peripheral.id, peripheral);
                setList(Array.from(peripherals.values()));
            }
        }).catch((error) => {
            console.log("Error-->", error);
        })

        BleManager.getConnectedPeripherals([]).then((results) => {
            if (results.length == 0) {
                console.log('No connected peripherals')
            }
            console.log("Connected results", results);
            for (var i = 0; i < results.length; i++) {
                var peripheral = results[i];
                peripheral.connected = true;
                peripherals.set(peripheral.id, peripheral);
                setList(Array.from(peripherals.values()));
            }
        });
    }

    const retrievedisConnected = () => {
        BleManager.getBondedPeripherals().then((results) => {
            console.log("res bonded devices--->", results);
            if (results.length == 0) {
                console.log('No connected peripherals')
            }
            console.log(results);
            for (var i = 0; i < results.length; i++) {
                var peripheral = results[i];
                peripheral.connected = true;
                peripherals.set(peripheral.id, peripheral);
                setList(Array.from(peripherals.values()));
            }
        }).catch((error) => {
            console.log("Error--->", error);
        })
    }

    const handleDiscoverPeripheral = (peripheral) => {
        console.log('Got ble peripheral', peripheral);
        if (!peripheral.name) {
            peripheral.name = 'NO NAME';
        }
        peripherals.set(peripheral.id, peripheral);
        setList(Array.from(peripherals.values()));
    }

    useEffect(() => {
        BleManager.start({ showAlert: false, forceLegacy: true });

        const ble1 = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
        const ble2 = bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
        const ble3 = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral);
        const ble4 = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);

        if (Platform.OS === 'android' && Platform.Version >= 23) {
            let finalPermission = Platform.Version >= 29 ? PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION : PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION;
            PermissionsAndroid.check(finalPermission).then((result) => {
                if (result) {
                    console.log("Permission is OK");
                    enableBluetoothInDevice()
                } else {
                    PermissionsAndroid.request(finalPermission).then((result) => {
                        if (result) {
                            console.log("User accept");
                            enableBluetoothInDevice()
                        } else {
                            console.log("User refuse");
                        }
                    });
                }
            });
        }

        return (() => {
            console.log('unmount');
            ble1.remove()
            ble2.remove()
            ble3.remove()
            ble4.remove()
        })
    }, []);

    const renderItem = (item, index) => {
        const color = item.connected ? 'Connected' : 'Not Connected';
        let servicesList;

        return (
            <TouchableOpacity
                onPress={() => checkphepriparal(item)}
                style={{
                    marginHorizontal: 10,
                    marginVertical: 10,
                    // padding: 10,
                    borderWidth: 2,
                    borderColor: "blue",
                }}>
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingRight: 10
                }}>
                    <View style={[styles.row, { alignItems: "flex-start", paddingHorizontal: 10, paddingVertical: 10 }]}>
                        <Text style={{ fontSize: 12, textAlign: 'center', color: '#333333', }}>{"Name: " + item.name}</Text>
                        <Text style={{ fontSize: 12, textAlign: 'center', color: '#333333', }}>RSSI: {item.rssi}</Text>
                        <Text style={{ fontSize: 12, textAlign: 'center', color: '#333333', }}>Device ID: {item.id}</Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: 12, textAlign: 'center', color: '#333333', }}>{color}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                    {/* <Button title='Read' onPress={() => { checkphepriparal(item, true) }} /> */}
                    {/* <Button title='Write' onPress={() => { checkphepriparal(item, false) }} /> */}
                    <Button title='Get Services' onPress={() => getService(item, index)} />
                </View>
                {
                    item.servicesList && item.servicesList.length ?
                        item.servicesList.map((obj) => {
                            return (
                                <View style={{ margin: 5, padding: 5, borderWidth: 0.5 }}>
                                    <Text style={{ fontSize: 13, color: 'blue', }}>Service Ids: {obj.service}</Text>
                                    {
                                        obj.characteristicList && obj.characteristicList.length
                                            ?
                                            obj.characteristicList.map((obj2) => {
                                                return (
                                                    <View style={{ marginVertical: 5, borderBottomWidth: 0.5, borderTopWidth: 0.5, paddingVertical: 5 }}>
                                                        <Text style={{ fontSize: 12, color: '#333333', }}>
                                                            characteristic : {obj2.characteristic}
                                                        </Text>
                                                        {obj2.properties ? <Text>{JSON.stringify(obj2.properties)}</Text> : null}

                                                        {obj2.properties ? <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                                                            {obj2.properties.Read ? <TouchableOpacity
                                                                onPress={() => {
                                                                    let tempObj = {
                                                                        id: item.id,
                                                                        name: item.name,
                                                                        service: obj.service,
                                                                        characteristic: obj2.characteristic
                                                                    }
                                                                    readAndWriteData(tempObj, true)
                                                                }}
                                                            >
                                                                <Text style={{ fontSize: 16, color: "red" }}>{"Read Data"}</Text>
                                                            </TouchableOpacity> : null}
                                                            {obj2.properties.Write ? <TouchableOpacity
                                                                onPress={() => {
                                                                    let tempObj = {
                                                                        id: item.id,
                                                                        name: item.name,
                                                                        service: obj.service,
                                                                        characteristic: obj2.characteristic
                                                                    }
                                                                    readAndWriteData(tempObj)
                                                                }}
                                                            >
                                                                <Text style={{ fontSize: 16, color: "green" }}>{"Write Data"}</Text>
                                                            </TouchableOpacity> : null}
                                                        </View> : null}
                                                    </View>
                                                )
                                            })
                                            :
                                            null
                                    }
                                </View>
                            )
                        })
                        : null
                }
            </TouchableOpacity>
        );
    }

    const getService = (item, index) => {
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
            let newList = list;
            newList[index].servicesList = tempdata;
            setRandom(Date.now())
            setList(newList);
        }).catch((err) => {
            console.log("err-->", err);
        })
    }

    const checkphepriparal = (peripheral, isRead) => {
        console.log("peripheral======>", peripheral);

        BleManager.isPeripheralConnected(peripheral.id, []).then((res) => {
            console.log(`${peripheral.name} is connected???`, res);

            if (res == false) {
                console.log("******not connected so going to connect...........");
                BleManager.connect(peripheral.id)
                    .then((res7) => {
                        // Success code
                        console.log("connect started", res7);
                        if (isRead) readServices(peripheral)
                        else { writeCharecteristics(peripheral) }
                    })
                    .catch((error) => { console.log("error---456464454->", error); });
            }
            else {
                if (isRead) readServices(peripheral)
                else { writeCharecteristics(peripheral) }
            }
        }).catch((error) => { console.log("Error--->", error) })
    }

    const readServices = async (peripheral) => {
        setBleValue("")
        BleManager.retrieveServices(peripheral.id).then((res1) => {
            console.log("retrieveServices started", res1);
            let readhasservice = res1.characteristics.filter((obj) => obj.properties.Read);
            console.log("readhasservice-->", readhasservice);

            // let writeServicesList = res1.characteristics.filter((obj) => obj.properties.Write);
            // console.log("writeServicesList-->", writeServicesList);

            BleManager.read(peripheral.id, readhasservice[0].service, readhasservice[0].characteristic).then((characteristic) => {
                console.log("Readable char ------<>", characteristic);
                const bytesString = String.fromCharCode(...characteristic)
                console.log('Bytes to string: ', bytesString)
                setBleValue(bytesString)
            }).catch((error) => {
                console.log("error--read error-->", error);
            });

        }).catch((error) => {
            console.log("error1515--->", error);
        })
    }

    const writeCharecteristics = async (peripheral) => {
        setHexValue("")
        BleManager.retrieveServices(peripheral.id).then((res1) => {
            console.log("retrieveServices started", res1);
            let writeServicesList = res1.characteristics.filter((obj) => obj.properties.Write);
            console.log("writeServicesList-->", writeServicesList);

            let yourStringData = "helso"
            let hexInput = Buffer.from(yourStringData, 'utf8').toString('hex');
            console.log("yourStringData: " + yourStringData);
            console.log("hexInput--->", hexInput);
            function convertStringToByteArray(str) {
                String.prototype.encodeHex = function () {
                    var bytes = [];
                    for (var i = 0; i < this.length; ++i) {
                        bytes.push(this.charCodeAt(i));
                    }
                    return bytes;
                };

                var byteArray = str.encodeHex();
                return byteArray
            }
            let tempBuffer = convertStringToByteArray(yourStringData)
            console.log("tempBuffer", tempBuffer);

            BleManager.write(peripheral.id, writeServicesList[0].service, writeServicesList[0].characteristic, tempBuffer).then(() => {
                console.log("successfully written--->");
                alert("successfully write: " + hexInput)
                setHexValue(hexInput)

                BleManager.startNotification(peripheral.id, writeServicesList[0].service, writeServicesList[0].characteristic).then(() => {
                    console.log("successfully noified--->");

                }).catch((error) => {
                    console.log(error);
                });
            }).catch((error) => {
                console.log(error);
            });

        }).catch((error) => {
            console.log("error1515--->", error);
        })
    }

    const readAndWriteData = (peripheral, isRead) => {
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
                        else writeCharData(peripheral)
                    })
                    .catch((error) => { console.log("error---456464454->", error); });
            }
            else {
                if (isRead) readCharData(peripheral)
                else writeCharData(peripheral)
            }
        }).catch((error) => { console.log("Error--->", error) })
    }

    const readCharData = (peripheral) => {
        setBleValue("")
        BleManager.read(peripheral.id, peripheral.service, peripheral.characteristic).then((characteristic) => {
            console.log("Readable char ------<>", characteristic);
            const bytesString = String.fromCharCode(...characteristic)
            console.log('Bytes to string: ', bytesString)
            setBleValue(bytesString)
        }).catch((error) => {
            console.log("error--read error-->", error);
        });
    }

    const writeCharData = (peripheral) => {
        setHexValue("")
        let yourStringData = message || "helso"
        let hexInput = Buffer.from(yourStringData, 'utf8').toString('hex');
        console.log("yourStringData: " + yourStringData);
        console.log("hexInput--->", hexInput);
        function convertStringToByteArray(str) {
            String.prototype.encodeHex = function () {
                var bytes = [];
                for (var i = 0; i < this.length; ++i) {
                    bytes.push(this.charCodeAt(i));
                }
                return bytes;
            };

            var byteArray = str.encodeHex();
            return byteArray
        }
        let tempBuffer = convertStringToByteArray(yourStringData)
        console.log("tempBuffer", tempBuffer);

        BleManager.write(peripheral.id, peripheral.service, peripheral.characteristic, tempBuffer).then(() => {
            console.log("successfully written--->");
            alert("successfully write: " + hexInput)
            setHexValue(hexInput)

            BleManager.startNotification(peripheral.id, peripheral.service, peripheral.characteristic).then(() => {
                console.log("successfully noified--->");

            }).catch((error) => {
                console.log(error);
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    contentContainerStyle={styles.scrollView}>

                    <View style={styles.body}>

                        <View style={{ margin: 10 }}>
                            <Button
                                title={'Scan Bluetooth (' + (isScanning ? 'on' : 'off') + ')'}
                                onPress={() => startScan()}
                            />
                        </View>

                        <View style={{ margin: 10 }}>
                            <Button title="Retrieve connected peripherals" onPress={() => retrieveConnected()} />
                        </View>

                        <View style={{ margin: 10 }}>
                            <Button title="Retrieve bonded peripherals" onPress={() => retrievedisConnected()} />
                        </View>

                        {(list.length == 0) &&
                            <View style={{ flex: 1, margin: 20 }}>
                                <Text style={{ textAlign: 'center' }}>No peripherals</Text>
                            </View>
                        }

                    </View>
                    <FlatList
                        data={list}
                        renderItem={({ item, index }) => renderItem(item, index)}
                        contentContainerStyle={{ flexGrow: 1, backgroundColor: "white" }}
                        extraData={randomNumber}
                        ListHeaderComponent={() => (
                            <Text style={{ color: "black", fontSize: 14, marginVertical: 10 }}>{"Connected Device List::"}</Text>
                        )}
                        keyExtractor={item => item.id}
                    />
                    {/* <View>
                        <Text style={{ color: "black", fontSize: 14, marginVertical: 10 }}>{"Write something in below box for write charectiristics::"}</Text>
                        <TextInput
                            value={message}
                            onChangeText={(message) => setMessage(message)}
                            placeholder='Write something...'
                            placeholderTextColor={"gray"}
                            style={{ borderWidth: 1, flex: 1, color: "black", margin: 10 }}
                        />

                        <Text style={{ marginVertical: 10 }}>{"Hex Value written is:: " + hexValue}</Text>
                        <Text>{"Value Read for read charectiristic is:: " + readValueFromBLE}</Text>
                        <Text>{"Value notified from Ble for charectiristic is:: " + notifyValueFromBLE}</Text>
                    </View> */}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        paddingVertical: 30
    },
    engine: {
        position: 'absolute',
        right: 0,
    },
    body: {
        backgroundColor: Colors.white,
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.black,
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
        color: Colors.dark,
    },
    highlight: {
        fontWeight: '700',
    },
    footer: {
        color: Colors.dark,
        fontSize: 12,
        fontWeight: '600',
        padding: 4,
        paddingRight: 12,
        textAlign: 'right',
    },
});

export default BletoothMainScreen;


// Null extracted folder for artifact: ResolvedArtifact(componentIdentifier=androidx.databinding:viewbinding:4.2.2, variantName=null, artifactFile=/home/mindbowser/.gradle/caches/modules-2/files-2.1/androidx.databinding/viewbinding/4.2.2/2b12946e18054c30a38e2f649aff5a1ada492b2b/viewbinding-4.2.2.aar, extractedFolder=null, dependencyType=ANDROID, isWrappedModule=false, buildMapping={__current_build__=/home/mindbowser/DemoProjects/ScrollViewDemo/ScrollViewDemo/android}, mavenCoordinatesCache=com.android.build.gradle.internal.ide.dependencies.MavenCoordinatesCacheBuildService$Inject@2a7ace2d)



// The 'kotlin-android-extensions' Gradle plugin is deprecated. Please use this migration guide (https://goo.gle/kotlin-android-extensions-deprecation) to start working with View Binding (https://developer.android.com/topic/libraries/view-binding) and the 'kotlin-parcelize' plugin.