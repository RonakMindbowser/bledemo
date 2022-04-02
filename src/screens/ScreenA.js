import React, { Component, useRef, useState, useEffect, useDebugValue } from 'react';
import {
    View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity,
    Image,
    Dimensions,
    StatusBar,
    Button,
    AppState,
    TextInput
} from 'react-native';
export default function ScreenA() {

    //* React.useState example
    const [list, setList] = useState([]);
    const [count, setCount] = useState(0);
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);

    const [fruitList, setFruitList] = useState([]);
    const [fruitName, setName] = useState("");

    const inputRef = useRef(null);

    //* React.useEffect example
    useEffect(() => {
        getUserList();

        const subscription = AppState.addEventListener("change", nextAppState => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === "active"
            ) {
                console.log("App has come to the foreground!");
            }

            appState.current = nextAppState;
            setAppStateVisible(appState.current);
            console.log("AppState", appState.current);
        });

        return () => {
            subscription.remove();
        };

    }, [])

    const checkOddEventCount = () => {
        const [value, setValue] = useState("odd");

        useEffect(() => {
            if (count % 2 == 0) setValue("even");
            else if (count % 2 != 0) setValue("odd");
        })
        useDebugValue(value == "odd" ? "<=====Odd======>" : "<=====Even======>");

        if (value == "odd") return "Odd"
        else if (value == "even") return "Even"
    }

    useEffect(() => {
        // alert("Button is clicked")
        console.log("Button is clicked");
    }, [count])

    const getUserList = async () => {
        const response = await fetch("https://reqres.in/api/users?page=1", { method: "GET" });
        const responseJson = await response.json();
        console.log("ResponseJson====>", responseJson);
        if (responseJson && responseJson.data && responseJson.data.length) {
            setList(responseJson.data)
        }
    }

    const addToFruitList = () => {

        if (fruitName.trim() == "") return false;

        // let temp = fruitList;
        // console.log("Tep=--->", temp);
        fruitList.push(fruitName)
        console.log("fruitListfruitList=--12->", fruitList);
        setFruitList(fruitList);
        setName("")
    }

    let renderListItem = ({ item, index }) => {
        return (
            <Text style={{ color: "black" }}>{item}</Text>
        )
    }

    const clickOnFocus = () => {
        inputRef.current.focus()
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={"#f7fbfc"} barStyle='dark-content' />
            <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 10 }}>
                <Text style={styles.headerText}>{"React.useState Example:"}</Text>
                <Button title='Click Me' onPress={() => setCount(count + 1)} />
                <Text style={{ color: "black" }}>Count: {count}</Text>

                <Text style={styles.headerText}>{"Custom Hook-UseEffect/UseState Example:"}</Text>
                <Text style={{ color: "black" }}>Event/Odd: {checkOddEventCount()}</Text>

                <Text style={styles.headerText}>{"React.useState Hook Example with array:"}</Text>
                <TextInput
                    placeholder='Enter Fruit Name'
                    ref={inputRef}
                    value={fruitName}
                    onChangeText={(fruitName) => setName(fruitName)}
                    placeholderTextColor={"gray"}
                    style={styles.textInput}
                />

                <Button title='Add Fruit to list' onPress={addToFruitList} />
                <View style={{ flex: 0.5 }}>
                    <FlatList
                        data={fruitList}
                        extraData={fruitList}
                        renderItem={renderListItem}
                        keyExtractor={(i, j) => j.toString()}
                    />
                </View>
                <Text style={styles.headerText}>{"React.useRef Hook Example :"}</Text>
                <Button title='Click Here to open TextInput' onPress={clickOnFocus} />

            </ScrollView>
        </View>
    )

}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7fbfc",
    },
    textInput: {
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
        color: "black",
        marginVertical: 20,
        marginHorizontal: 10
    },
    headerText: {
        fontSize: 16,
        color: "black",
        fontWeight: "bold",
        marginVertical: 20
    }
})