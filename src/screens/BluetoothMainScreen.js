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
import { ColorPicker, fromHsv, TriangleColorPicker } from 'react-native-color-picker';
import { hexToRgb, hsv2rgb, HSVtoRGB } from '../Utils';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
var Buffer = require('buffer/').Buffer  // note: the trailing slash is important!

import { CustomHeader, CustomLoader } from "react-native-reusable-custom-components";
import images from '../assets/images/images';
import { useNavigation } from '@react-navigation/native';

const BletoothMainScreen = (props) => {
	// console.log("Prop---->", props);
	const [isScanning, setIsScanning] = useState(false);
	const [message, setMessage] = useState("");
	const [hexValue, setHexValue] = useState("");
	const [readValueFromBLE, setBleValue] = useState("");
	const [notifyValueFromBLE, setNotifyValue] = useState("");
	const peripherals = new Map();
	const [list, setList] = useState([]);
	const [randomNumber, setRandom] = useState(Date.now())
	const [isBluetoothStarted, setBluetoothtoggle] = React.useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false)
	const [helpModalVisible, toggleHelpModal] = useState(false)

	const serviceUUIDForWriteBlubColor = "ffb0"
	const characteristicUUIDForWriteBlubColor = "ffb2"
	const fullBrightNessHexValue = 49; // 1
	const zeroBrightNessHexValue = 48; // 0

	const navigation = useNavigation();

	useEffect(() => {
		BleManager.start({ showAlert: false, forceLegacy: true });

		const ble1 = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
		const ble2 = bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
		const ble3 = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral);
		const ble4 = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);

		checkForBluetoothPermission()

		return (() => {
			console.log('unmount');
			ble1.remove()
			ble2.remove()
			ble3.remove()
			ble4.remove()
		})
	}, []);

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
		setIsRefreshing(false)
	}

	const handleDisconnectedPeripheral = (data) => {
		let peripheral = peripherals.get(data.peripheral);
		if (peripheral) {
			peripheral.connected = false;
			peripherals.set(peripheral.id, peripheral);
			setList(Array.from(peripherals.values()));
		}
		console.log('Disconnected from ' + JSON.stringify(data));
		alert("BLE Device is Disconnected")
		props.navigation.goBack()
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
				startScan()
			})
			.catch((error) => {
				console.log("rror-r---->", error);
				// Failure code
			});
	}

	const handleDiscoverPeripheral = (peripheral) => {
		console.log('Got ble peripheral', peripheral);
		if (!peripheral.name) {
			peripheral.name = 'NO NAME';
		}
		peripherals.set(peripheral.id, peripheral);
		setList(Array.from(peripherals.values()));
	}

	const onRefresh = () => {
		setIsRefreshing(true)
		startScan()
	}

	const checkForBluetoothPermission = () => {
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
	}

	const renderItem = (item, index) => {
		console.log("Item---->", item);
		return (
			<TouchableOpacity
				// onPress={() => checkphepriparal(item)}
				style={{
					marginHorizontal: 10,
					marginVertical: 10,
					borderWidth: 2,
					borderColor: "blue",
					paddingVertical: 15
				}}>
				<View style={{
					flexDirection: "row",
					justifyContent: "space-between",
					paddingRight: 10
				}}>
					<View style={[styles.row, { alignItems: "flex-start", paddingHorizontal: 10, paddingVertical: 10 }]}>
						<Text style={{ fontSize: 12, textAlign: 'center', color: '#333333', }}>{"Smart Blub " + (index + 1)}</Text>
					</View>
					{
						item.servicesList && item.servicesList.length ?
							<Switch
								trackColor={{ false: "#767577", true: "#81b0ff" }}
								thumbColor={item.isEnabled ? "#f5dd4b" : "#f4f3f4"}
								ios_backgroundColor="#3e3e3e"
								onValueChange={(value) => handleBlubToggleValue(value, item, index)}
								value={item.isEnabled}
							/>
							: null
					}
				</View>
				{
					item.servicesList && item.servicesList.length ?
						<View>
							<View style={{ height: 300 }}>
								<ColorPicker
									onColorSelected={color => {
										applyConversion(color, item)
										// applyConversion("#FFF5EE", item)
									}}
									style={{ flex: 1 }}
									hideControls
									hideSliders
									onColorChange={selectedColor => {
										console.log("selectedColor-->", selectedColor)
									}}
								/>
							</View>
						</View>
						:
						null
				}
				<View style={{ flexDirection: "row", justifyContent: "space-around" }}>
					<Button title='Get Services' onPress={() => getService(item, index)} />
				</View>

			</TouchableOpacity>
		);
	}

	const applyConversion = (color, item) => {
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
		}
		readAndWriteData(tempObj)
	}

	const getService = (item, index) => {

		BleManager.isPeripheralConnected(item.id, []).then((res) => {
			console.log(`${item.name} is connected while getting serives???`, res);

			if (res == false) {
				console.log("******not connected so going to connect...........");
				BleManager.connect(item.id)
					.then((res7) => {
						// Success code
						console.log("connect started", res7);
						getServicesForDevice(item, index)
					}).catch((error) => {
						console.log("error while getting service conenction:", error);
					})
			}
			else {
				getServicesForDevice(item, index)
			}
		}).catch((error) => {
			console.log("Error when checking connection--->", error);
		})
	}

	const handleBlubToggleValue = (value, item, index) => {
		console.log("value,item,index-->", value, item, index);

		if (value) {
			let tempObj = {
				id: item.id,
				name: item.name,
				service: serviceUUIDForWriteBlubColor,
				characteristic: characteristicUUIDForWriteBlubColor,
				writeValueData: [fullBrightNessHexValue, 255, 255, 255]
			}
			readAndWriteData(tempObj)
		}
		else {
			let tempObj = {
				id: item.id,
				name: item.name,
				service: serviceUUIDForWriteBlubColor,
				characteristic: characteristicUUIDForWriteBlubColor,
				writeValueData: [zeroBrightNessHexValue, 0, 0, 0]
			}
			readAndWriteData(tempObj)
		}

		let newList = list;
		newList[index].isEnabled = value;
		setRandom(Date.now())
		setList(newList);
	}

	const getServicesForDevice = (item, index) => {
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
			newList[index].isEnabled = true;
			setRandom(Date.now())
			setList(newList);
		}).catch((err) => {
			console.log("err-->", err);
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

	const writeCharData = (peripheral) => {

		try {
			BleManager.write(peripheral.id,
				peripheral.service,
				peripheral.characteristic,
				peripheral.writeValueData	// [48, 0, 0, 0]	//	tempBuffer
			).then((response) => {
				console.log("Resonse---->", response);
			}).catch(error => {
				console.log("Error--->", error);
			})
		} catch (error) {
			console.log("Error---123123123-<", error);
		}
	}

	const renderListEmptyComponent = () => {
		return (
			<View style={{
				alignItems: "center",
				justifyContent: "center",
				flex: 1,
				height: "100%"
			}}>
				{
					isScanning ?
						<Text style={{ color: "black", fontSize: 16 }}>{"Scanning for Smart Blub..."}</Text>
						:
						<View style={{}}>
							<Text style={{ color: "black", fontWeight: "600", fontSize: 16, textAlign: "center" }}>{"No Smart Blub Found."}</Text>
							<Text style={{ color: "black", fontWeight: "400", fontSize: 14, marginTop: 20, textAlign: "center" }}>{"Please make sure smart blubs are powered on."}</Text>

							<Text style={{ color: "blue", fontWeight: "600", fontSize: 16, marginTop: 30, textAlign: "center" }}>{"Troubleshooting Help"}</Text>
							<Text style={{ color: "black", fontWeight: "400", fontSize: 14, }}>{"1. Restart the bluetooth"}</Text>
							<Text style={{ color: "black", fontWeight: "400", fontSize: 14, }}>{"2. Click on Refresh Icon."}</Text>
							<Text style={{ color: "black", fontWeight: "400", fontSize: 14, }}>{"3. Restart Smart blub."}</Text>
							<Text style={{ color: "black", fontWeight: "400", fontSize: 14, }}>{"4. Unintstall app and reinstall again."}</Text>
						</View>
				}
			</View>
		)
	}

	const renderBlubList = ({ item, index }) => {
		console.log("Item---->", item);

		return (
			<TouchableOpacity style={{
				marginHorizontal: 20,
				flexDirection: "row",
				alignItems: "center",
				marginVertical: 10,
				justifyContent: "space-between"
			}}
				onPress={() => onPressSingleBlub(item, index)}
			>
				<View style={{
					flexDirection: "row",
					alignItems: "center",
				}}>
					<Image source={images.smartBlubIcon}
						style={{ height: 30, width: 30 }}
					/>
					<Text style={{ color: "black", marginLeft: 20 }}>{"Smart Blub " + (index + 1)}</Text>
				</View>
				{/* <TouchableOpacity style={{
					backgroundColor: "blue",
					padding: 5,
					borderRadius: 5,
				}}
					onPress={() => connectBLEDevice(item, index)}
				>
					<Text style={{
						color: "white"
					}}>{"Connect"}</Text>
				</TouchableOpacity> */}
				{
					item.isConnecting ?
						<ActivityIndicator />
						: null
				}
			</TouchableOpacity>
		)
	}


	const onPressSingleBlub = (item, index) => {
		connectBLEDevice(item, index)
	}

	const connectBLEDevice = (item, index) => {
		toggleConnecting(true, index)

		BleManager.isPeripheralConnected(item.id, []).then((res) => {
			if (res == false) {
				BleManager.connect(item.id)
					.then((res7) => {
						console.log("Response--BLE connect--->", res7);
						redirectUserToNext(item, index)
					}).catch((error) => {
						console.log("Error---BLE connect--->", error);
						toggleConnecting(false, index)
						ToastAndroid.show("Something went wrong while connecting..", ToastAndroid.SHORT)
					})
			}
			else {
				console.log("already connected");
				redirectUserToNext(item, index)
			}
		}).catch((error) => {
			console.log("Error---isPeripheralConnected->", error);
			toggleConnecting(false, index)
			ToastAndroid.show("Something went wrong while connecting..", ToastAndroid.SHORT)
		})
	}

	const redirectUserToNext = (item, index) => {
		toggleConnecting(false, index)
		ToastAndroid.show("Connected successfully", ToastAndroid.SHORT)
		navigation.navigate("BLEDeviceService", {
			peripheral: item
		})
	}

	const toggleConnecting = (value, index) => {
		let temp = list;
		temp[index].isConnecting = value;
		setList(temp)
		setRandom(Date.now())
	}

	const onRequestClose = () => {
		toggleHelpModal(false)
	}

	console.log("list ------>", list);
	return (
		// <View style={{ flex: 1, backgroundColor: "white" }}>
		// 	<StatusBar barStyle="dark-content" />
		// 	<SafeAreaView>
		// 		<ScrollView
		// 			contentInsetAdjustmentBehavior="automatic"
		// 			contentContainerStyle={styles.scrollView}>
		// 			<View style={styles.body}>
		// 				<View style={{ margin: 10 }}>
		// 					<Button
		// 						title={'Scan Bluetooth (' + (isScanning ? 'on' : 'off') + ')'}
		// 						onPress={() => startScan()}
		// 					/>
		// 				</View>
		// 				{(list.length == 0) &&
		// 					<View style={{ flex: 1, margin: 20 }}>
		// 						<Text style={{ textAlign: 'center' }}>No peripherals</Text>
		// 					</View>
		// 				}
		// 			</View>
		// 			<FlatList
		// 				data={list}
		// 				renderItem={({ item, index }) => renderItem(item, index)}
		// 				contentContainerStyle={{ flexGrow: 1, backgroundColor: "white" }}
		// 				extraData={randomNumber}
		// 				ListHeaderComponent={() => (
		// 					<Text style={{ color: "black", fontSize: 14, marginVertical: 10, marginHorizontal: 10 }}>{"Connected Devices::"}</Text>
		// 				)}
		// 				keyExtractor={item => item.id}
		// 			/>
		// 		</ScrollView>
		// 	</SafeAreaView>
		// </View>

		<View style={{ flex: 1, backgroundColor: "white" }}>
			<CustomHeader
				backButton
				middleText='Bluetooth Low Energy'
				onBackButtonPress={() => navigation.goBack()}
			/>
			<ScrollView
				refreshControl={
					<RefreshControl
						refreshing={isRefreshing}
						onRefresh={() => onRefresh()}
					/>
				}
				contentContainerStyle={{ flexGrow: 1 }}
			>
				<FlatList
					data={list}
					keyExtractor={item => item.id}
					extraData={randomNumber}
					contentContainerStyle={{ flexGrow: 1, backgroundColor: "white" }}
					ListEmptyComponent={renderListEmptyComponent}
					renderItem={renderBlubList}
				/>
			</ScrollView>
			{
				isScanning ?
					<CustomLoader loading={isScanning} />
					: null
			}
			<View style={{ position: "absolute", bottom: 10, flexDirection: "row", justifyContent: "space-between" }}>
				<TouchableOpacity style={{ alignItems: "center", width: "50%" }} onPress={startScan}>
					<Image
						source={images.refreshIcon}
						style={{ height: 30, width: 30, }}
					/>
					<Text style={{
						fontSize: 16, fontWeight: "700", color: "black"
					}}>{"Refresh"}</Text>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={() => toggleHelpModal(true)}
					style={{ alignItems: "center", width: "50%" }}>
					<Image
						source={images.helpIcon}
						style={{ height: 30, width: 30, }}
					/>
					<Text style={{
						fontSize: 16, fontWeight: "700", color: "black"
					}}>{"Help"}</Text>
				</TouchableOpacity>
			</View>

			<View>
				<Modal
					visible={helpModalVisible}
					animationType={'slide'}
					onRequestClose={onRequestClose}
					transparent={true}
				>
					<TouchableHighlight
						underlayColor={"transparent"}
						onPress={onRequestClose}
						style={styles.outerViewModalStyle}
					>
						<TouchableOpacity delayPressIn={0} onPress={() => null} activeOpacity={1}>
							<View style={styles.modal}>
								<View style={{ paddingHorizontal: 20 }}>
									<Text style={{ color: "blue", fontWeight: "600", fontSize: 16, marginVertical: 15, textAlign: "center" }}>{"Troubleshooting Help"}</Text>
									<Text style={{ color: "black", fontWeight: "400", fontSize: 14, }}>{"1. Restart the bluetooth"}</Text>
									<Text style={{ color: "black", fontWeight: "400", fontSize: 14, }}>{"2. Click on Refresh Icon."}</Text>
									<Text style={{ color: "black", fontWeight: "400", fontSize: 14, }}>{"3. Restart Smart blub."}</Text>
									<Text style={{ color: "black", fontWeight: "400", fontSize: 14, }}>{"4. Unintstall app and reinstall again."}</Text>
								</View>
							</View>
						</TouchableOpacity>
					</TouchableHighlight>
				</Modal>
			</View>
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
	outerViewModalStyle: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.75)',
		justifyContent: 'center',
	},
	modal: {
		backgroundColor: "white",
		borderRadius: 10,
		marginHorizontal: 20,
		// marginHorizontal: 10
		paddingBottom: 20
	},
});

export default BletoothMainScreen;


// Null extracted folder for artifact: ResolvedArtifact(componentIdentifier=androidx.databinding:viewbinding:4.2.2, variantName=null, artifactFile=/home/mindbowser/.gradle/caches/modules-2/files-2.1/androidx.databinding/viewbinding/4.2.2/2b12946e18054c30a38e2f649aff5a1ada492b2b/viewbinding-4.2.2.aar, extractedFolder=null, dependencyType=ANDROID, isWrappedModule=false, buildMapping={__current_build__=/home/mindbowser/DemoProjects/ScrollViewDemo/ScrollViewDemo/android}, mavenCoordinatesCache=com.android.build.gradle.internal.ide.dependencies.MavenCoordinatesCacheBuildService$Inject@2a7ace2d)



// The 'kotlin-android-extensions' Gradle plugin is deprecated. Please use this migration guide (https://goo.gle/kotlin-android-extensions-deprecation) to start working with View Binding (https://developer.android.com/topic/libraries/view-binding) and the 'kotlin-parcelize' plugin.