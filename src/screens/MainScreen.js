import { useNavigation } from '@react-navigation/native';
import React, { } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity
} from 'react-native';
import AnimationScreen from './Animation.Screen';
export default function MainScreen(props) {

    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button}
                onPress={() => navigation.navigate("ScreenA")}
            >
                <Text style={styles.textInput}>
                    {"Basic useEffect and useState , useRef Example"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}
                onPress={() => navigation.navigate("ScreenB")}
            >
                <Text style={styles.textInput}>{"Basic useContext Example"}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}
                onPress={() => navigation.navigate("ScreenC")}
            >
                <Text style={styles.textInput}>{"useReducer Example"}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}
                onPress={() => navigation.navigate("ScreenD")}
            >
                <Text style={styles.textInput}>{"useCallback and useMemo Example"}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}
                onPress={() => navigation.navigate("ScreenE")}
            >
                <Text style={styles.textInput}>{"useImperativeHandle and useLayoutEffect Example"}</Text>
            </TouchableOpacity>

            {/* <AnimationScreen /> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7fbfc",
        justifyContent: "center"
    },
    textInput: {
        color: "black",
    },
    button: {
        backgroundColor: "red",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        marginHorizontal: 20,
        marginVertical: 10
    }
})