import React, { Component, useRef, useState, useEffect, useContext, useReducer, useCallback, useMemo } from 'react';
import {
    View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity,
} from 'react-native';
const functionsCounter = new Set()

export default function ScreenD() {

    const [count, setCount] = useState(0)
    const [otherCounter, setOtherCounter] = useState(0)
    // const increment = () => {
    //     setCount(count + 1)
    // }
    // const decrement = () => {
    //     setCount(count - 1)
    // }
    // const incrementOtherCounter = () => {
    //     setOtherCounter(otherCounter + 1)
    // }

    const increment = useCallback(() => {
        setCount(count + 1)
    }, [count])
    const decrement = useCallback(() => {
        setCount(count - 1)
    }, [count])
    const incrementOtherCounter = useCallback(() => {
        setOtherCounter(otherCounter + 1)
    }, [otherCounter])

    functionsCounter.add(increment)
    functionsCounter.add(decrement)
    functionsCounter.add(incrementOtherCounter)
    console.log("functionsCounter------->", functionsCounter);
    // alert(functionsCounter.size)
    let numtmp = 5;
    const addSum = (num) => {
        console.log("Add Sum is called");
        return num + num
    }

    //This will render multiple time 
    // const finalValue = addSum(numtmp), [numtmp]);

    //This will render when numtmp changes
    const finalValue = useMemo(() => addSum(numtmp), [numtmp]);

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>{"React.useCallback Example:"}</Text>
            <TouchableOpacity
                style={{ backgroundColor: "yellow", padding: 10 }}
                onPress={increment}
            >
                <Text style={styles.textInput}>{"increment(+)"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{ backgroundColor: "yellow", padding: 10 }}
                onPress={decrement}
            >
                <Text style={styles.textInput}>{"decrement(-)"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{ backgroundColor: "yellow", padding: 10 }}
                onPress={incrementOtherCounter}
            >
                <Text style={styles.textInput}>{"incrementOtherCounter"}</Text>
            </TouchableOpacity>

            <Text style={styles.headerText}>{"React.useMemo Example:"}</Text>
            <Text style={styles.textInput}>count is::{count}</Text>

            <Text style={styles.textInput}>sum is::{finalValue}</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7fbfc",
        justifyContent: "center",
        alignItems: "center"
    },
    textInput: {
        color: "black",
        fontSize: 14,
        paddingHorizontal: 10
    },
    headerText: {
        fontSize: 16,
        color: "black",
        fontWeight: "bold",
        marginVertical: 20
    }
})