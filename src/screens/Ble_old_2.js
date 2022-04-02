/**
 * Sample BLE React Native App
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
} from 'react-native';

import {
    Colors,
} from 'react-native/Libraries/NewAppScreen';
import BleManager from "react-native-ble-manager";
import { stringToBytes, bytesToString } from "convert-string";

//   import BleManager from '../BleManager';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
var Buffer = require('buffer/').Buffer  // note: the trailing slash is important!
function buf2hex(buffer) { // buffer is an ArrayBuffer
    return [...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
}

// EXAMPLE:
const buffer = new Uint8Array([4, 102, 102, 32, 108, 105, 103, 104, 116]).buffer;
console.log(buf2hex(buffer)); // = 04080c10

const App = () => {
    const [isScanning, setIsScanning] = useState(false);
    const peripherals = new Map();
    const [list, setList] = useState([]);
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
        console.log("Data---->Received--->", data);
        const converteddata = bytesToString(data.value);
        console.log("converteddata---->Received--->", converteddata);
        console.log(`Recieved ${converteddata} for characteristic ${data.characteristic}`);
        console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);

        function bytesToWritableArray(bytes) {
            // WritableArray value = Arguments.createArray();
            // for (int i = 0; i < bytes.length; i++)
            // value.pushInt((bytes[i] & 0xFF));
            // return value;
            let value = [];
            for (let index = 0; index < bytes.length; index++) {
                value.push(parseInt(bytes[index], 8))
            }
            return value;
        }

        var arr = bytesToWritableArray(data.dataValue);
        console.log("arr---->", arr);

        function bin2String(array) {
            var result = "";
            for (var i = 0; i < array.length; i++) {
                result += String.fromCharCode(parseInt(array[i], 2));
            }
            return result;
        }


        let temp2 = bin2String(["01100110", "01101111", "01101111"]); // "foo"
        // let temp2 = bin2String(data.value);
        console.log("Temp2-333---.", temp2);

        // create an array view of some valid bytes
        // let bytesView = new Uint8Array(arr);
        let bytesView = new Uint8Array(data.value);
        let bytesView1 = new Int16Array(data.value);
        console.log(bytesView);
        console.log(bytesView1);
        // convert bytes to string
        // encoding can be specfied, defaults to utf-8 which is ascii.
        let str = new TextDecoder().decode(bytesView);
        console.log(str);

        let str2 = new TextDecoder().decode(bytesView1);
        console.log(str2);
        alert("successfully read: " + str)

        function strEncodeUTF16(str) {
            var buf = new ArrayBuffer(str.length * 2);
            var bufView = new Uint16Array(buf);
            for (var i = 0, strLen = str.length; i < strLen; i++) {
                bufView[i] = str.charCodeAt(i);
            }
            console.log("dataValue0000---->", bufView);
            return bufView;
        }



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
                console.log("The user refuse to enable bluetooth");
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

    const renderItem = (item) => {
        const color = item.connected ? 'green' : '#fff';
        return (
            <TouchableHighlight onPress={() => checkphepriparal(item)}>
                <View style={[styles.row, { backgroundColor: color }]}>
                    <Text style={{ fontSize: 12, textAlign: 'center', color: '#333333', padding: 10 }}>{item.name}</Text>
                    <Text style={{ fontSize: 10, textAlign: 'center', color: '#333333', padding: 2 }}>RSSI: {item.rssi}</Text>
                    <Text style={{ fontSize: 8, textAlign: 'center', color: '#333333', padding: 2, paddingBottom: 20 }}>{item.id}</Text>
                </View>
            </TouchableHighlight>
        );
    }

    const checkphepriparal = (peripheral) => {
        console.log("peripheral======>", peripheral);

        BleManager.isPeripheralConnected(peripheral.id, []).then((res) => {
            console.log(`${peripheral.name} is connected???`, res);

            if (res == false) {
                console.log("******not connected so going to connect...........");
                BleManager.connect(peripheral.id)
                    .then((res7) => {
                        // Success code
                        console.log("connect started", res7);

                        readServices(peripheral)
                    })
                    .catch((error) => {
                        // Failure code
                        console.log("error---456464454->", error);
                    });
            }
            else {
                readServices(peripheral)
            }
        }).catch((error) => {
            console.log("Error--->", error);
        })
    }

    const readServices = async (peripheral) => {
        BleManager.retrieveServices(peripheral.id).then((res1) => {
            console.log("retrieveServices started", res1);

            let readhasservice = res1.characteristics.filter((obj) => obj.properties.Read);
            console.log("readhasservice-->", readhasservice);

            let writeServicesList = res1.characteristics.filter((obj) => obj.properties.Write);
            console.log("writeServicesList-->", writeServicesList);

            let yourStringData = "helso"
            // const data = stringToBytes(yourStringData);
            let hexInput = Buffer.from(yourStringData, 'utf8').toString('hex');
            // let asciiInput = Buffer.from(yourStringData, 'utf8').toString('ascii');
            // var buf = Buffer.from(yourStringData, 'utf8').buffer;

            console.log("yourStringData: " + yourStringData);
            // console.log("asciiInput: " + asciiInput);
            // console.log("Write: " + data);
            console.log("hexInput--->", hexInput);
            // console.log("buf-buf-->", buf);
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
            // var str = "Hello";
            console.log("tempBuffer", tempBuffer);
            // function bin2String(array) {
            //     var result = "";
            //     for (var i = 0; i < array.length; i++) {
            //         result += String.fromCharCode(parseInt(array[i], 2));
            //     }
            //     return result;
            // }

            BleManager.read(peripheral.id, writeServicesList[0].service, writeServicesList[0].characteristic).then((characteristic) => {
                console.log("Readable char ------<>", characteristic);
                // const buffer = Buffer.from(characteristic); //https://github.com/feross/buffer#convert-arraybuffer-to-buffer
                // console.log("buffer----->", buffer);
                // const sensorData = buffer.readUInt8(1, true);
                // console.log("sensorData----->", sensorData);
                // let temp = bin2String(buffer);
                // console.log("Temp-->", temp);
                // 1
                const byteArray = [65, 66, 67, 68, 69, 70]

                // 2
                const bytesString = String.fromCharCode(...characteristic)

                // 3
                console.log('Bytes to string: ', bytesString)

            }).catch((error) => {
                // Failure code
                console.log("error--read error-->", error);
            });

            BleManager.write(peripheral.id, writeServicesList[0].service, writeServicesList[0].characteristic, tempBuffer).then(() => {
                // Success code
                console.log("successfully written--->");
                alert("successfully write: " + hexInput)
            }).catch((error) => {
                // Failure code
                console.log(error);
            });

            BleManager.startNotification(peripheral.id, writeServicesList[0].service, writeServicesList[0].characteristic).then(() => {
                console.log("successfully noified--->");

            }).catch((error) => {
                // Failure code
                console.log(error);
            });

        }).catch((error) => {
            console.log("error1515--->", error);
        })
    }

    return (
        <>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={styles.scrollView}>
                    {global.HermesInternal == null ? null : (
                        <View style={styles.engine}>
                            <Text style={styles.footer}>Engine: Hermes</Text>
                        </View>
                    )}
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
                </ScrollView>
                <FlatList
                    data={list}
                    renderItem={({ item }) => renderItem(item)}
                    keyExtractor={item => item.id}
                />
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: Colors.lighter,
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

export default App;


// Null extracted folder for artifact: ResolvedArtifact(componentIdentifier=androidx.databinding:viewbinding:4.2.2, variantName=null, artifactFile=/home/mindbowser/.gradle/caches/modules-2/files-2.1/androidx.databinding/viewbinding/4.2.2/2b12946e18054c30a38e2f649aff5a1ada492b2b/viewbinding-4.2.2.aar, extractedFolder=null, dependencyType=ANDROID, isWrappedModule=false, buildMapping={__current_build__=/home/mindbowser/DemoProjects/ScrollViewDemo/ScrollViewDemo/android}, mavenCoordinatesCache=com.android.build.gradle.internal.ide.dependencies.MavenCoordinatesCacheBuildService$Inject@2a7ace2d)



// The 'kotlin-android-extensions' Gradle plugin is deprecated. Please use this migration guide (https://goo.gle/kotlin-android-extensions-deprecation) to start working with View Binding (https://developer.android.com/topic/libraries/view-binding) and the 'kotlin-parcelize' plugin.