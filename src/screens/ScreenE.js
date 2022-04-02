import React, { Component, useRef, useState, useEffect, useContext, useReducer, useImperativeHandle, forwardRef, useLayoutEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity,
    TextInput,
} from 'react-native';

export const CustomTextInput = forwardRef((props, ref) => {
    const verify = () => {
        console.log("-----Verify() function called----")
        // You can actual verify and update your states here and also perform other stuff
    }

    const validate = () => {
        console.log("-----validate() function called----")
    }

    useImperativeHandle(ref, () => ({ verify, validate }), [])

    return (
        <TextInput {...props} />
    )
})

export default function ScreenE() {

    const inputRefCustom = useRef(null);
    const [value, setValue] = useState("");
    const [fruitName, setName] = useState("");

    const onChange = (value) => {
        setValue(value)
        inputRefCustom.current.validate();
        inputRefCustom.current.verify();
    }

    useEffect(() => {
        if (fruitName == "MindWork") {
            setName("Company")
        }
        console.log("useEffect is called");
    }, [fruitName])

    useLayoutEffect(() => {
        if (fruitName == "MindWork") {
            setName("Company")
        }
        console.log("useLayoutEffect is called");
    }, [fruitName])

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>{"React.useImperativeHandle Hook Example :"}</Text>
            <CustomTextInput
                ref={inputRefCustom}
                value={value}
                onChangeText={onChange}
                style={styles.textInput}
                placeholderTextColor={"gray"}
                placeholder='Enter Fruit Name'
            />

            <Text style={styles.headerText}>{"React.useLayoutEffect Hook Example "}</Text>

            <TextInput
                placeholder='Enter Fruit Name'
                value={fruitName}
                onChangeText={(fruitName) => setName(fruitName)}
                placeholderTextColor={"gray"}
                style={styles.textInput}
            />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7fbfc",
        // justifyContent: "center",
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