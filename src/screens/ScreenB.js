import React, { Component, useRef, useState, useEffect, useContext } from 'react';
import {
    View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity,
} from 'react-native';
export default function ScreenB() {

    var themes = {
        light: {
            foreground: "white",
            background: "blue"
        },
        dark: {
            foreground: "yellow",
            background: "black"
        }
    };

    var [currentTheme, setCurrentTheme] = useState(themes.dark)

    const ThemeContext = React.createContext(currentTheme);

    function Toolbar(props) {
        return (
            <ThemedButton toggleTheme={props.toggleTheme} />
        );
    }

    function ThemedButton(props) {
        const theme = useContext(ThemeContext);
        return (
            <View style={{
                flex: 1, alignItems: "center", justifyContent: "center",
                backgroundColor: theme.background, padding: 20
            }}>

                <TouchableOpacity style={{
                    padding: 10,
                    marginVertical: 10,
                    backgroundColor: theme.foreground
                }}
                    onPress={props.toggleTheme}
                >
                    <Text style={{ color: theme.background }}>{"Click Here to Toggle Theme"}</Text>
                </TouchableOpacity>
                <Text style={{ color: theme.foreground }}> I am styled by theme context! </Text>
            </View>
        );
    }

    let toggleTheme = () => {
        console.log("toggle theme", currentTheme);
        let finaltheme = JSON.stringify(currentTheme) == JSON.stringify(themes.light) ? themes.dark : themes.light
        // setCurrentTheme((prevTheme) => (prevTheme === themes.light ? themes.dark : themes.light))
        setCurrentTheme(finaltheme)
    }

    return (
        <View style={styles.container}>
            <ThemeContext.Provider value={currentTheme}>
                <Toolbar toggleTheme={toggleTheme} />
            </ThemeContext.Provider>
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