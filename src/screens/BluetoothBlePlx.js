import React, {
    useState,
    useEffect,
} from 'react';
import {
    View,
    Text,
    Platform,
    PermissionsAndroid,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import RNBle from "react-native-ble-manager";
import { BleManager } from 'react-native-ble-plx';
var Buffer = require('buffer/').Buffer  // note: the trailing slash is important!
// import { multiply } from "react-native-awesome-module";

// import { multiply } from "react-native-reusable-custom-components";

const BluetoothBlePlx = () => {

    // useEffect(async () => {
    //     let response = await multiply(5, 10)
    //     console.log("response-->", response);
    // }, []);

    const [isBluetoothStarted, setBluetoothtoggle] = React.useState(false);
    const [loading, toggleLoading] = useState(false);
    const [device, setDevice] = useState(null);
    const [serviceData, setServiceData] = useState(null);

    var bluetoothManager = new BleManager();
    useEffect(() => {
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

        const subscription = bluetoothManager.onStateChange((state) => {
            console.log("bluetooth state is:: ", state);
            if (state === 'PoweredOn') {
                scanAndConnect();
                subscription.remove();
            }
        }, true);

        return () => {
            subscription.remove();
        }
    }, [])

    const enableBluetoothInDevice = async () => {
        RNBle.enableBluetooth()
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

    const scanAndConnect = () => {
        toggleLoading(true)
        bluetoothManager.startDeviceScan(null, {}, (error, device) => {
            toggleLoading(false)
            console.log("Error--->", error);
            console.log("device--->", device);
            // alert(device.name)
            if (error) {
                // Handle error (scanning will be stopped automatically)
                return
            }
            setServiceData(device);
            // if (Object.keys(device).length) bluetoothManager.stopDeviceScan()
            // Check if it is a device you are looking for based on advertisement data
            // or other criteria.
            if (device.name === 'TI BLE Sensor Tag' ||
                device.name === 'SensorTag') {

                // Stop scanning as it's not necessary if you are scanning for one device.
                // bluetoothManager.stopDeviceScan();

                // Proceed with connection.
            }

            bluetoothManager.stopDeviceScan();

            // device.isConnected().then((connected) => {
            //     console.log("is connected--->", connected);

            //     if (connected == false) {
            //         // device.connect().then((connectionResponse) => {
            //         //     console.log("connectionResponse--->", connectionResponse);
            //         //     device.discoverAllServicesAndCharacteristics().then((services) => {
            //         //         console.log("SErvices--->", services);
            //         //     }).catch((error) => {
            //         //         console.log("discoverAllServicesAndCharacteristics error-->", error);
            //         //     })

            //         //     device.readCharacteristicForService().then((characteristic) => {
            //         //         console.log("readCharacteristicForService characteristic-->", characteristic);

            //         //     }).catch((error) => {
            //         //         console.log("readCharacteristicForService error-->", error);
            //         //     })

            //         // }).catch((error) => {
            //         //     console.log("error--connectionResponse->", error);
            //         //     console.log("error--connectionResponse->", JSON.stringify(error));
            //         // })

            //         device.connect()
            //             .then((device1) => {
            //                 setDevice(device1)
            //                 return device1.discoverAllServicesAndCharacteristics()
            //             })
            //             .then((device2) => {
            //                 console.log("scan device response---->", device2);
            //                 // Do work on device with services and characteristics
            //             })
            //             .catch((error) => {
            //                 console.log("****error ****", error);
            //                 toggleLoading(false)
            //                 // Handle errors
            //             });
            //     }
            //     else {
            //         device.discoverAllServicesAndCharacteristics().then((services) => {
            //             toggleLoading(false)
            //             console.log("SErvices--->", services);
            //         }).catch((error) => {
            //             toggleLoading(false)
            //             console.log("discoverAllServicesAndCharacteristics error-->", error);
            //         })
            //     }

            // }).catch((error) => {
            //     console.log("check connection error--->", error);
            //     toggleLoading(false)
            // })


            // device.connect()
            //     .then((device) => {
            //         console.log("device =-=-=-=-=-=", device);
            //         return device.isConnected()
            //     })
            //     .then((device) => {
            //         console.log("Devce---132132---->", device);
            //         // Do work on device with services and characteristics
            //     })
            //     .catch((error) => {
            //         console.log("error-132------>", error);
            //         console.log("error-132------>", JSON.stringify(error));
            //         // Handle errors
            //     });
            device
                .isConnected() // check whether it's already conncted
                .then((isConnected) => {
                    console.log('isConnected::', isConnected);
                    return isConnected ? device : device.connect();
                })
                .then((d) => {
                    console.log('connect::', d);
                    return d.discoverAllServicesAndCharacteristics();
                })
                .then(async (d) => {
                    console.log('discoverAllServicesAndCharacteristics::', d);
                    const services = await d.services();
                    console.log('services servicesservices::', services);
                    return services.map(async (service) => {
                        try {
                            const characteristic = await d.characteristicsForService(service.uuid);
                            console.log("characteristic--->", characteristic);
                            return {
                                ...service,
                                characteristicList: characteristic,
                            };
                        } catch (error) {
                            console.log("characteristic---error--->", error);
                        }
                    });
                })
                .then((services) => {
                    console.log('discoverAllServicesAndCharacteristics:123:', services);
                    Promise.all(services).then((response) => {
                        console.log("resolve", response);
                        setServiceData(response)
                    }).catch((error) => {
                        console.log("resolve error---->", error);
                    })
                    // return d.services();
                    // services.map(()=>{
                    //     return device.readCharacteristicForService()
                    // })
                })
                .catch((error) => {
                    console.log("error--->", error);
                })

        });
    }

    const renderListItem = ({ item, index }) => {
        return (
            <View style={{ marginVertical: 20, marginHorizontal: 10, borderWidth: 0.5, borderColor: "gray", padding: 5 }}>
                <Text style={{ color: "black", marginBottom: 5 }}>{"Device Id::" + item.deviceID}</Text>
                <Text style={{ color: "red" }}>{"Service Id::"}</Text>
                <Text style={{ color: "red" }}>{item.uuid}</Text>
                {
                    item.characteristicList.map((obj, id) => {
                        return (
                            <View style={{ marginVertical: 10, borderWidth: 1 }}>
                                <Text style={{ color: "darkgray" }}>{id}:{"Char id:"}</Text>
                                <Text style={{ color: "darkgray" }}>{obj.uuid}</Text>
                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                    {obj.isReadable ? <TouchableOpacity onPress={() => {

                                        console.log("device details:::", item);
                                        console.log("Char details:::", obj);

                                        bluetoothManager.isDeviceConnected(item.deviceID).then((res2) => {
                                            console.log("Device is connected or not:::", res2);
                                            if (res2) {
                                                bluetoothManager.readCharacteristicForDevice(item.deviceID, item.uuid, obj.uuid).then((characteristicRead) => {
                                                    console.log("characteristicRead----->", characteristicRead)
                                                }).catch((error) => {
                                                    console.log("Error---characteristicRead-->", error)
                                                })
                                            }
                                            else {
                                                bluetoothManager.connectToDevice(item.deviceID).then((response1) => {
                                                    console.log("response1==::::", response1)

                                                    bluetoothManager.readCharacteristicForDevice(item.deviceID, item.uuid, obj.uuid).then((characteristicRead) => {
                                                        console.log("characteristicRead----->", characteristicRead)
                                                    }).catch((error) => {
                                                        console.log("Error---characteristicRead-->", error)
                                                    })

                                                }).catch((error) => {
                                                    console.log("Error connectToDevice---", error)
                                                })
                                            }

                                        }).catch((error) => {

                                        })


                                    }}>
                                        <Text style={{ color: "blue", fontSize: 14 }}>{"Read characteristics"}</Text>
                                    </TouchableOpacity> : null}
                                    {
                                        obj.isWritableWithResponse ?
                                            <TouchableOpacity onPress={() => {
                                                console.log("device details:::", item);
                                                console.log("Char details:::", obj);

                                                bluetoothManager.isDeviceConnected(item.deviceID).then((res2) => {
                                                    console.log("Device is connected or not:::", res2);

                                                    if (res2) {
                                                        let encodedAuth = new Buffer("New Test Message").toString("base64");
                                                        console.log("encodedAuth--->", encodedAuth);
                                                        bluetoothManager.writeCharacteristicWithResponseForDevice(item.deviceID, obj.serviceUUID,
                                                            obj.uuid, encodedAuth).then((characteristicObj) => {

                                                            }).catch((error) => {
                                                                console.log("Error --->Char wrte", error)
                                                            })
                                                    }
                                                    else {
                                                        bluetoothManager.connectToDevice(item.deviceID).then((response1) => {
                                                            console.log("response1==::::", response1)

                                                            bluetoothManager.writeCharacteristicWithResponseForDevice(item.deviceID, obj.serviceUUID,
                                                                obj.uuid, encodedAuth).then((characteristicObj) => {

                                                                }).catch((error) => {
                                                                    console.log("Error --->Char wrte", error)
                                                                })

                                                        }).catch((error) => {
                                                            console.log("Error connectToDevice---", error)
                                                        })
                                                    }

                                                }).catch((error) => {

                                                })

                                            }}>
                                                <Text style={{ color: "blue", fontSize: 14 }}>{"Write characteristics"}</Text>
                                            </TouchableOpacity>
                                            : null
                                    }
                                </View>
                            </View>
                        )
                    })
                }
                {/* <TouchableOpacity onPress={()=>{}}>
                    <Text style={{ color: "blue", fontSize: 16 }}>{"Read characteristics"}</Text>
                </TouchableOpacity> */}
            </View>
        )
    }

    return (
        <View style={{ flex: 1 }}>

            {
                loading ?
                    <ActivityIndicator size={"large"} />
                    : null
            }
            {
                device ?
                    <Text>{"Device Name is::", device.name}</Text>
                    : null
            }
            {
                serviceData ?
                    <FlatList
                        renderItem={renderListItem}
                        data={serviceData}
                    />
                    : null
            }
        </View>
    )
}

export default BluetoothBlePlx;