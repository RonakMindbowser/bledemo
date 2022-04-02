// import { useNavigation } from '@react-navigation/native';
// import React, { } from 'react';
// import {
//     View, Text, StyleSheet, TouchableOpacity, PermissionsAndroid, Button
// } from 'react-native';
// import BleManager from "react-native-ble-manager";
// // import { BleManager } from 'react-native-ble-plx';

// export default function BluetoothMainScreen(props) {
//     const navigation = useNavigation();
//     const [isLocationPermissionAvailable, setLocationPermission] = React.useState(false);
//     const [isBluetoothStarted, setBluetoothtoggle] = React.useState(false);
//     // var bluetoothManager = new BleManager();
//     // // var bluetoothManager = null;

//     // React.useEffect(() => {
//     //     checkPermission()
//     //     scanAndConnect()
//     //     // return bluetoothManager
//     // }, [])

//     // const checkPermission = async () => {
//     //     // const granted = await PermissionsAndroid.request(
//     //     //     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//     //     //     {
//     //     //         title: 'Permission Localisation Bluetooth',
//     //     //         message: 'Requirement for Bluetooth',
//     //     //         buttonNeutral: 'Later',
//     //     //         buttonNegative: 'Cancel',
//     //     //         buttonPositive: 'OK',
//     //     //     }
//     //     // );
//     //     PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
//     //         if (result) {
//     //             console.log("Permission is OK");
//     //         } else {
//     //             PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
//     //                 if (result) {
//     //                     console.log("User accept");
//     //                 } else {
//     //                     console.log("User refuse");
//     //                 }
//     //             });
//     //         }
//     //     });

//     // }
//     // function scanAndConnect() {
//     //     bluetoothManager.startDeviceScan(null, null, (error, device) => {
//     //         console.log("device---->", device);
//     //         console.log("error---->", error);
//     //         if (error) {
//     //             // Handle error (scanning will be stopped automatically)
//     //             return
//     //         }
//     //         // Check if it is a device you are looking for based on advertisement data
//     //         // or other criteria.
//     //         if (device.name === 'TI BLE Sensor Tag' ||
//     //             device.name === 'SensorTag') {

//     //             // Stop scanning as it's not necessary if you are scanning for one device.
//     //             bluetoothManager.stopDeviceScan();

//     //             // Proceed with connection.
//     //         }
//     //     });
//     // }

//     React.useEffect(() => {

//         checkForLocation()

//         BleManager.start({ showAlert: false }).then(() => {
//             console.log("Module initialized");
//         }).catch((error) => {
//             console.log("Error-->", error);
//         });
//     })

//     const checkForLocation = () => {
//         PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
//             if (result) {
//                 console.log("Permission is OK");
//                 setLocationPermission(true)
//                 enableBluetoothInDevice()

//             } else {
//                 PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
//                     if (result) {
//                         console.log("User accept");
//                         setLocationPermission(true)
//                         enableBluetoothInDevice()
//                     } else {
//                         console.log("User refuse");
//                         setLocationPermission(false)
//                     }
//                 });
//             }
//         });
//     }

//     const enableBluetoothInDevice = () => {
//         BleManager.enableBluetooth()
//             .then(() => {
//                 // Success code
//                 console.log("The bluetooth is already enabled or the user confirm");
//                 setBluetoothtoggle(true)
//             })
//             .catch((error) => {
//                 // Failure code
//                 console.log("The user refuse to enable bluetooth");
//             });
//     }


//     const scanForDevice = () => {
//         BleManager.scan([], 20, true, {

//         }).then(() => {
//             // Success code
//             console.log("Scan started");
//         }).catch((error) => {
//             console.log("Error--->", error);
//         });
//     }

//     const retrieveConnected = () => {
//         BleManager.getDiscoveredPeripherals([]).then((results) => {
//             console.log('results peripherals', results)
//             if (results.length == 0) {
//                 console.log('No connected peripherals')
//             }
//             console.log(results);
//             for (var i = 0; i < results.length; i++) {
//                 var peripheral = results[i];
//                 peripheral.connected = true;
//                 peripherals.set(peripheral.id, peripheral);
//                 // setList(Array.from(peripherals.values()));
//             }
//         });
//     }

//     return (
//         <View style={styles.container}>
//             <Text style={styles.header}>{"Bluetooth is On::" + isBluetoothStarted}</Text>
//             {
//                 !isBluetoothStarted ?
//                     <Button onPress={checkForLocation} title='Turn on Bluetooth' />
//                     : null
//             }
//             {
//                 isBluetoothStarted ?
//                     <Button title='Scan For Device' onPress={scanForDevice} />
//                     : null
//             }
//             {
//                 isBluetoothStarted ?
//                     <Button title="Retrieve connected peripherals" onPress={() => retrieveConnected()} />
//                     : null
//             }
//         </View>
//     )
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#f7fbfc",
//         justifyContent: "center"
//     },
//     textInput: {
//         color: "black",
//     },
//     button: {
//         backgroundColor: "red",
//         paddingHorizontal: 20,
//         paddingVertical: 10,
//         borderRadius: 10,
//         marginHorizontal: 20,
//         marginVertical: 10
//     },
//     header: {
//         fontSize: 14,
//         color: "black"
//     }
// })




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

    const testPeripheral = (peripheral) => {
        //     console.log("peripheral-->", peripheral);
        //     if (peripheral) {
        //         if (peripheral.connected) {
        //             BleManager.disconnect(peripheral.id, true);
        //         } else {
        //             BleManager.connect(peripheral.id).then(() => {
        //                 let p = peripherals.get(peripheral.id);
        //                 if (p) {
        //                     p.connected = true;
        //                     peripherals.set(peripheral.id, p);
        //                     setList(Array.from(peripherals.values()));
        //                 }
        //                 console.log('Connected to ' + peripheral.id);


        //                 setTimeout(() => {

        //                     /* Test read current RSSI value */
        //                     BleManager.retrieveServices(peripheral.id).then((peripheralData) => {
        //                         console.log('Retrieved peripheral services', peripheralData);

        //                         BleManager.readRSSI(peripheral.id).then((rssi) => {
        //                             console.log('Retrieved actual RSSI value', rssi);
        //                             let p = peripherals.get(peripheral.id);
        //                             if (p) {
        //                                 p.rssi = rssi;
        //                                 peripherals.set(peripheral.id, p);
        //                                 setList(Array.from(peripherals.values()));
        //                             }
        //                         });
        //                     });

        //                     // Test using bleno's pizza example
        //                     // https://github.com/sandeepmistry/bleno/tree/master/examples/pizza

        //                     BleManager.retrieveServices(peripheral.id).then((peripheralInfo) => {
        //                         console.log(peripheralInfo);
        //                         var service = '13333333-3333-3333-3333-333333333337';
        //                         var bakeCharacteristic = '13333333-3333-3333-3333-333333330003';
        //                         var crustCharacteristic = '13333333-3333-3333-3333-333333330001';
        //                         setTimeout(() => {
        //                             BleManager.startNotification(peripheral.id, service, bakeCharacteristic).then(() => {
        //                                 console.log('Started notification on ' + peripheral.id);
        //                                 setTimeout(() => {
        //                                     BleManager.write(peripheral.id, service, crustCharacteristic, [0]).then(() => {
        //                                         console.log('Writed NORMAL crust');
        //                                         BleManager.write(peripheral.id, service, bakeCharacteristic, [1, 95]).then(() => {
        //                                             console.log('Writed 351 temperature, the pizza should be BAKED');

        //                                             //var PizzaBakeResult = {
        //                                             //  HALF_BAKED: 0,
        //                                             //  BAKED:      1,
        //                                             //  CRISPY:     2,
        //                                             //  BURNT:      3,
        //                                             //  ON_FIRE:    4
        //                                             //};
        //                                         });
        //                                     });
        //                                 }, 500);
        //                             }).catch((error) => {
        //                                 console.log('Notification error', error);
        //                             });
        //                         }, 200);
        //                     });



        //                 }, 900);
        //             }).catch((error) => {
        //                 console.log('Connection error', error);
        //             });
        //         }
        //     }

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
            // bleManagerEmitter.removeListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
            // bleManagerEmitter.removeListener('BleManagerStopScan', handleStopScan);
            // bleManagerEmitter.removeListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral);
            // bleManagerEmitter.removeListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);
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

                        BleManager.retrieveServices(peripheral.id).then((res1) => {
                            console.log("retrieveServices started", res1);

                            let readhasservice = res1.characteristics.filter((obj) => obj.properties.Read);
                            console.log("readhasservice-->", readhasservice);

                            // BleManager.read(peripheral.id, readhasservice[0].service, readhasservice[0].characteristic).then((res3) => {
                            //     console.log("res3---->", res3);

                            //     const buffer = Buffer.from(res3); //https://github.com/feross/buffer#convert-arraybuffer-to-buffer
                            //     const sensorData = buffer.readUInt8(1, true);
                            //     console.log("sensorData-1321312-->", sensorData);

                            //     // BleManager.createBond(peripheral.id).then((res4) => {
                            //     //     console.log("res4 create bond", res4);
                            //     // }).catch((error) => {
                            //     //     console.log("161661error-create bond-->", error);
                            //     // })
                            // }).catch((error) => {
                            //     console.log("161661error-1321312-->", error);
                            // })

                            let writeServicesList = res1.characteristics.filter((obj) => obj.properties.Write);
                            console.log("writeServicesList-->", writeServicesList);

                            // BleManager.startNotificationUseBuffer(peripheral.id, res1.characteristics[4].service, res1.characteristics[4].characteristic, 102).then((res2) => {
                            //     console.log("res2---->", res2);
                            // }).catch((error) => {
                            //     console.log("161661error--->", error);
                            // })
                        }).catch((error) => {
                            console.log("error1515--->", error);
                        })


                    })
                    .catch((error) => {
                        // Failure code
                        console.log("error---456464454->", error);
                    });

                // BleManager.createBond(peripheral.id).then((res) => {
                //     console.log("res--->", res);
                //     // alert(res)
                //     BleManager.connect(peripheral.id).then((res) => {
                //         console.log("res---132>", res);
                //         // alert(res)
                //     }).catch((error) => {
                //         console.log("errro---.>>>>>", error);
                //         alert(0)
                //     })
                // }).catch(() => {
                //     alert(0)
                // })

                // BleManager.refreshCache(peripheral.id)
                //     .then((peripheralInfo) => {
                //         // Success code
                //         console.log("cache refreshed!");
                //     })
                //     .catch((error) => {
                //         console.error(error);
                //     });
            }
            else {
                BleManager.retrieveServices(peripheral.id).then((res1) => {
                    console.log("retrieveServices started", res1);

                    let readhasservice = res1.characteristics.filter((obj) => obj.properties.Read);
                    console.log("readhasservice-->", readhasservice);

                    // BleManager.read(peripheral.id, readhasservice[0].service, readhasservice[0].characteristic).then((res3) => {
                    //     console.log("res3---->", res3);

                    //     const buffer = Buffer.from(res3); //https://github.com/feross/buffer#convert-arraybuffer-to-buffer
                    //     const sensorData = buffer.readUInt8(1, true);
                    //     console.log("sensorData-1321312-->", sensorData);

                    //     // BleManager.createBond(peripheral.id).then((res4) => {
                    //     //     console.log("res4 create bond", res4);
                    //     // }).catch((error) => {
                    //     //     console.log("161661error-create bond-->", error);
                    //     // })
                    // }).catch((error) => {
                    //     console.log("161661error-1321312-->", error);
                    // })

                    let writeServicesList = res1.characteristics.filter((obj) => obj.properties.Write);
                    console.log("writeServicesList-->", writeServicesList);

                    let yourStringData = "off light"
                    const data = stringToBytes(yourStringData);
                    let hexInput = Buffer.from(yourStringData, 'utf8').toString('hex');
                    console.log("yourStringData: " + yourStringData);
                    console.log("Write: " + data);
                    console.log("hexInput--->", hexInput);

                    BleManager.write(peripheral.id, writeServicesList[0].service, writeServicesList[0].characteristic, data).then(() => {
                        // Success code
                        console.log("successfully written--->");
                    })
                        .catch((error) => {
                            // Failure code
                            console.log(error);
                        });

                    BleManager.startNotification(peripheral.id, writeServicesList[0].service, writeServicesList[0].characteristic).then(() => {
                        console.log("successfully noified--->");

                    }).catch((error) => {
                        // Failure code
                        console.log(error);
                    });

                    // BleManager.startNotificationUseBuffer(peripheral.id, res1.characteristics[4].service, res1.characteristics[4].characteristic, 102).then((res2) => {
                    //     console.log("res2---->", res2);
                    // }).catch((error) => {
                    //     console.log("161661error--->", error);
                    // })
                }).catch((error) => {
                    console.log("error1515--->", error);
                })
            }
        }).catch((error) => {
            console.log("Error--->", error);
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