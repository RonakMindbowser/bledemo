import React, { Component, useRef, useState, useEffect, useContext, useReducer } from 'react';
import {
    View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity,
} from 'react-native';

const initialState = { count: 0 };

function reducer(state, action) {
    switch (action.type) {
        case 'increment':
            return { count: state.count + 1 };
        case 'decrement':
            return { count: state.count - 1 };
        default:
            throw new Error();
    }
}

export default function ScreenC() {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                    style={{ backgroundColor: "yellow", padding: 10 }}
                    onPress={() => dispatch({ type: "decrement" })}
                >
                    <Text style={styles.textInput}>{"decrement(-)"}</Text>
                </TouchableOpacity>
                <Text style={styles.textInput}>{state.count}</Text>
                <TouchableOpacity
                    style={{ backgroundColor: "yellow", padding: 10 }}
                    onPress={() => dispatch({ type: "increment" })}
                >
                    <Text style={styles.textInput}>{"increment(+)"}</Text>
                </TouchableOpacity>
            </View>
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