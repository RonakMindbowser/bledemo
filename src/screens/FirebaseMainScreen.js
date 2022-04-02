import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput, Button, Keyboard
} from 'react-native';
import functions from '@react-native-firebase/functions';
// import { firebase } from '@react-native-firebase/functions';

export default function FirebaseMainScreen(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [simpleText, setText] = useState("");
    React.useEffect(() => {
        if (__DEV__) {
            try {
                functions().useFunctionsEmulator("http://localhost:5001")
            } catch (error) {
                console.log("error local port", error);
            }
        }
        callHTTPFunctions()
        callScheduleFunction()
    }, [])

    const callHTTPFunctions = async () => {

        try {
            const response = await functions().httpsCallable("getListOfUser")({});
            console.log("response", response);



            const response2 = await functions().httpsCallable("helloWorld")({});
            console.log("response2", response2);

            if (response2.data) setText(response2.data)

        } catch (error) {
            console.log("error-->", error);
        }
    }

    const callScheduleFunction = async () => {
        try {
            await functions().httpsCallable("scheduledFunction")({})
        } catch (error) {
            console.log("error-456->", error);

        }
    }

    const createUser = async () => {
        if (email.trim() == "" || password.trim() == "") {
            alert("missing data")
        }
        else {
            Keyboard.dismiss();
            const response = await functions().httpsCallable("createUser")({ email, password });
            console.log("response", response);
            if (response.data.uid) alert("Created successfully")
        }
    }

    return (
        <View style={styles.container}>

            <Text style={{ color: "black", alignSelf: "center", margin: 10, fontSize: 15 }}>{simpleText}</Text>

            <TextInput
                placeholder='Enter Email'
                // ref={inputRef}
                value={email}
                onChangeText={(email) => setEmail(email)}
                placeholderTextColor={"gray"}
                style={styles.textInput}
                keyboardType='email-address'
                returnKeyType='next'
                blurOnSubmit={false}
            />
            <TextInput
                placeholder='Enter Password'
                // ref={inputRef}
                value={password}
                onChangeText={(password) => setPassword(password)}
                placeholderTextColor={"gray"}
                style={styles.textInput}
                secureTextEntry
                blurOnSubmit={false}
            />
            <Button onPress={createUser} title='Create User' />
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
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
        color: "black",
        marginVertical: 20,
        marginHorizontal: 10,
        fontSize: 16
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