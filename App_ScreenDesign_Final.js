import React, { Component, useRef, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity,
    Image,
    Dimensions,
    StatusBar
} from 'react-native';
import images from './src/assets/images/images';

export default function RNApp() {

    const [userDetails, setUserDetails] = useState({
        userName: "William Shakes",
        userId: "01",
        snapShotNo: '03',
        snapShotDate: "2020-01-02",
    });
    const [showFullDetails, toggleDetails] = useState(false);
    const [currentIndex, toggleIndex] = useState(0);

    const [myWorldList, setMyWorld] = useState([
        {
            que_title: "Abuse",
            que_causes: [
                {
                    cause_name: "Attacked Verbally",
                },
                {
                    cause_name: "Harsh Discipline",
                },
            ]
        },
        {
            que_title: "Grief",
            que_causes: [
                {
                    cause_name: "Difficulty Coping With Grief Responses Among Individuals/Families",
                },
            ]
        },
        {
            que_title: "Caretaking / Parenting",
            que_causes: [
                {
                    cause_name: "Difficulty Interpreting Of Responding To Verbal/Nonverbal Communication",
                },
                {
                    cause_name: "Difficulty Providing Physical Care/Safety",
                },
                {
                    cause_name: "Expectations Incongruent With Stage Of Growth And Development",
                },
            ]
        },
    ]);

    const renderListItem = ({ item, index }) => {
        let indexTmp = parseInt(index + 1)
        return (
            <View style={{ marginVertical: 10 }}>
                <Text style={styles.titleText}>{"Q"}{indexTmp}. {item.que_title}</Text>
                {
                    item.que_causes && item.que_causes.length && item.que_causes.map((obj) => {
                        return (
                            <View style={styles.causeView}>
                                <View style={styles.dotView} />
                                <Text style={styles.causeName}>{obj.cause_name}</Text>
                            </View>
                        )
                    })
                }
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={"#f7fbfc"} barStyle='dark-content' />
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.headerView}>
                    <Image source={images.backIcon} />
                    <Text style={styles.backText}>{"Back"}</Text>
                </View>
                <View style={styles.wrapView}>
                    <View style={styles.headerWrap}>
                        <View style={styles.nameWrap}>
                            <Image
                                source={{ uri: "https://picsum.photos/200/300" }}
                                style={styles.profileImageView}
                            />
                            <Text style={styles.userName}>{userDetails.userName}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.upDownView}
                            onPress={() => { toggleDetails((prevValue) => !prevValue) }}
                        >
                            <Image source={images.upDownIcon} style={{
                                transform: [{ rotate: showFullDetails ? "90deg" : "270deg" }]
                            }} />
                        </TouchableOpacity>
                    </View>

                    {showFullDetails ? <View style={styles.hiddenWrap}>
                        <View style={styles.userDataView}>
                            <Text style={styles.leftText}>{"ID:"}</Text>
                            <Text style={styles.rightText}>{userDetails.userId}</Text>
                        </View>
                        <View style={styles.userDataView}>
                            <Text style={styles.leftText}>{"Snapshot No:"}</Text>
                            <Text style={styles.rightText}>{userDetails.snapShotNo}</Text>
                        </View>
                        <View style={styles.userDataView}>
                            <Text style={styles.leftText}>{"Snapshot Date:"}</Text>
                            <Text style={styles.rightText}>{userDetails.snapShotDate}</Text>
                        </View>
                    </View> : null}

                </View>
                <View style={styles.wrapView}>
                    <View style={styles.middleWrap}>
                        <TouchableOpacity
                            style={styles.buttonWrap}
                            onPress={() => { toggleIndex(0) }}
                        >
                            <Text style={[styles.buttonText, { borderBottomWidth: currentIndex == 0 ? 2 : 0, }]}>{"My World"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonWrap}
                            onPress={() => { toggleIndex(1) }}
                        >
                            <Text style={[styles.buttonText, { borderBottomWidth: currentIndex == 1 ? 2 : 0, }]}>{"My Health Reactive"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.wrapView}>
                    <FlatList
                        data={myWorldList}
                        extraData={myWorldList}
                        bounces={false}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}
                        keyExtractor={(i, j) => j.toString()}
                        renderItem={renderListItem}
                    />
                </View>
            </ScrollView>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7fbfc",
    },
    backText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "black",
        paddingHorizontal: 5
    },
    userName: {
        fontSize: 18,
        fontWeight: "600",
        color: "#667aa0",
        paddingHorizontal: 10
    },

    userDataView: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 5
    },
    leftText: {
        fontSize: 14,
        color: "black",
        fontWeight: "600",
        flex: 0.5
    },
    rightText: {
        fontSize: 14,
        color: "#213e76",
        flex: 0.5
    },
    wrapView: {
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#e2e2e2",
        marginHorizontal: 10,
        marginVertical: 10,
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 10
    },
    buttonText: {
        fontSize: 16,
        color: "#b6b6b6",
        fontWeight: "bold",
        borderColor: "#b6b6b6",
        paddingBottom: 5
    },
    titleText: {
        fontSize: 16,
        color: "#b6b6b6",
        fontWeight: "bold",
        marginBottom: 10
    },
    causeName: {
        color: "black",
        fontWeight: "600",
        fontSize: 14,
        flex: 1
    },
    dotView: {
        height: 8,
        width: 8,
        borderRadius: 20,
        backgroundColor: "#36599b",
        marginTop: 5,
        marginRight: 10
    },
    causeView: {
        flexDirection: "row",
        alignItems: "flex-start",
        paddingVertical: 5,
    },
    headerView: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    profileImageView: {
        height: 70,
        width: 70,
        borderRadius: 50,
    },
    nameWrap: {
        flexDirection: "row",
        alignItems: "center",
    },
    upDownView: {
        alignItems: "center",
        justifyContent: "center"
    },
    hiddenWrap: {
        paddingVertical: 10,
        paddingHorizontal: 5
    },
    middleWrap: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 5
    },
    buttonWrap: {
        flex: 0.5,
        alignItems: "center",
        justifyContent: "center"
    },
    headerWrap: {
        flexDirection: "row",
        justifyContent: "space-between"
    }
})