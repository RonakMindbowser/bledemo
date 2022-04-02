import React, { Component, useRef, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity,
    SectionList as RNSectionList,
    Image,
    Dimensions
} from 'react-native';
import axios from 'axios';

const { height: deviceHeight, width: deviceWidth } = Dimensions.get("screen");

export default function RNApp() {

    const [list, setList] = useState([]);

    React.useEffect(() => {
        getUserList();
        callMultipleApiUsingAxios();
    }, [])

    const callMultipleApiUsingAxios = async () => {
        let firstApi = "https://jsonplaceholder.typicode.com/posts"
        let secondApi = "https://jsonplaceholder.typicode.com/users"

        let pageOneUserList = "https://reqres.in/api/users?page=1";
        let pageTwoUserList = "https://reqres.in/api/users?page=2";
        let pageThreeUserList = "https://reqres.in/api/users?page=3";

        let firstCall = axios.get(firstApi)
        let secondCall = axios.get(secondApi)

        let pageOneCall = axios.get(pageOneUserList)
        let pageTwoCall = axios.get(pageTwoUserList)
        let pageThreeCall = axios.get(pageThreeUserList)

        let listApiCalls = [firstCall, secondCall, pageOneCall, pageTwoCall, pageThreeCall]

        //* Using Axios.all method
        axios.all(listApiCalls).then(axios.spread((...responses) => {
            console.log("Axios Multiple Api Response:: ", responses);

        })).catch((error) => {
            console.log("Error--->", error);
        })

        //* Using Axios.all method and get each response and using try catch
        try {
            let [rs1, rs2, rs3, rs4, rs5] = await axios.all(listApiCalls);
            // console.log("222 Api axios call--->", responses);
            console.log("111 Api axios call--->", rs1);
            console.log("222 Api axios call--->", rs2);
            console.log("333 Api axios call--->", rs3);
            console.log("444 Api axios call--->", rs4);
            console.log("555 Api axios call--->", rs5);
        } catch (error) {
            console.log("Error 2222--->", error);

        }

        //* Using Promise.all method
        Promise.all(listApiCalls).then((responses) => {
            console.log("Promise all Multiple Api Response:: ", responses);

        }).catch((error) => {
            console.log("Error-promise all-->", error);
        })

    }

    //* Get User List to display in list and for zIndex demo
    const getUserList = async () => {
        const response = await fetch("https://reqres.in/api/users?page=1", { method: "GET" });
        const responseJson = await response.json();
        console.log("ResponseJson====>", responseJson);
        if (responseJson && responseJson.data && responseJson.data.length) {
            setList(responseJson.data)
        }
    }

    //* render method for display single item from list
    const renderListItem = ({ item, index }) => {
        return (
            <View style={styles.itemView}>
                <Image
                    source={{ uri: item.avatar }}
                    style={styles.profileImageStyle}
                />
                <View style={styles.dataView}>
                    <Text style={styles.email}>{"Email : " + item.email}</Text>
                    <Text style={styles.fullname}>{"Full Name : " + item.first_name + " " + item.last_name}</Text>
                </View>
                <TouchableOpacity style={styles.secondView}>
                    <Text style={styles.email}>{"Add to list"}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>{"Zindex Example with UserList"}</Text>
            <View>
                {
                    list.length ?
                        <FlatList
                            data={list}
                            extraData={list}
                            bounces={false}
                            showsVerticalScrollIndicator={false}
                            renderItem={renderListItem}
                            contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
                        />
                        : null
                }
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    headerText: {
        fontSize: 20,
        color: "black",
        fontWeight: "bold",
        alignSelf: "center",
        paddingVertical: 20
    },
    itemView: {
        height: 200,
        width: deviceWidth - 20,
        marginVertical: 10,
        marginHorizontal: 10,
    },
    email: {
        color: "white",
        fontSize: 14,
    },
    fullname: {
        color: "white",
        fontSize: 14
    },
    dataView: {
        zIndex: 1,
        top: -50,
        backgroundColor: "rgba(0,0,0,0.5)",
        paddingVertical: 10
    },
    profileImageStyle: {
        height: "100%",
        width: "100%",
    },
    secondView: {
        zIndex: 2,
        top: -80,
        alignSelf: "flex-end",
        backgroundColor: "red",
        padding: 5,
        borderRadius: 5
    }
})