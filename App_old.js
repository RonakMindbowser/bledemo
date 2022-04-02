import React, { Component, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';

export default function App() {

    const flatListRef = useRef()
    const [ticketList, setTicketList] = useState([
        {
            title: "State License",
            newList: [
                {
                    subTitle: "Np State License",
                    subHeader: "Arkansas",
                    expireDate: "Mar 31, 2024",
                    status: "On Track"
                },
                {
                    subTitle: "Np State License",
                    subHeader: "Delaware",
                    expireDate: "Feb 25, 2024",
                    status: "On Track"
                },
                {
                    subTitle: "Np State License",
                    subHeader: "South Carolina",
                    expireDate: "Apr 30, 2022",
                    status: "On Track"
                }
            ]
        },
        {
            title: "New Registrations",
            newList: [
                {
                    subTitle: "Np State License",
                    subHeader: "Arkansas",
                    expireDate: "Mar 31, 2024",
                    status: "On Track"
                },
                {
                    subTitle: "Np State License",
                    subHeader: "Delaware",
                    expireDate: "Feb 25, 2024",
                    status: "On Track"
                },
                {
                    subTitle: "Np State License",
                    subHeader: "South Carolina",
                    expireDate: "Apr 30, 2022",
                    status: "On Track"
                }
            ]
        },
        {
            title: "Controlled Substance Registration",
            newList: [
                {
                    subTitle: "Np State License",
                    subHeader: "Arkansas",
                    expireDate: "Mar 31, 2024",
                    status: "On Track"
                },
                {
                    subTitle: "Np State License",
                    subHeader: "Delaware",
                    expireDate: "Feb 25, 2024",
                    status: "On Track"
                },
                {
                    subTitle: "Np State License",
                    subHeader: "South Carolina",
                    expireDate: "Apr 30, 2022",
                    status: "On Track"
                }
            ]
        },
        {
            title: "Other",
            newList: [
                {
                    subTitle: "Np State License",
                    subHeader: "Arkansas",
                    expireDate: "Mar 31, 2024",
                    status: "On Track"
                },
                {
                    subTitle: "Np State License",
                    subHeader: "Delaware",
                    expireDate: "Feb 25, 2024",
                    status: "On Track"
                },
                {
                    subTitle: "Np State License",
                    subHeader: "South Carolina",
                    expireDate: "Apr 30, 2022",
                    status: "On Track"
                }
            ]
        }
    ])

    function renderHeaderComponent() {
        return (
            <View style={{ flex: 1, paddingTop: 10, paddingBottom: 30, backgroundColor: "white" }}>
                <View style={styles.topView}>
                    <Text style={styles.nameText}>{"Hello Loren Ipsum"}</Text>
                    <Text style={styles.simpleText}>{"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."}</Text>
                </View>
                <FlatList
                    horizontal
                    data={ticketList}
                    bounces={false}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 10, paddingVertical: 10 }}
                    renderItem={({ item, index }) => {
                        if (!item.newList.length) return null;
                        return (
                            <TouchableOpacity style={styles.titleView} onPress={() => {

                                // if (flatListRef.current) {
                                // flatListRef.current.scrollToEnd({ animated: false })
                                flatListRef.current.scrollToIndex({ animated: true, index: index, viewOffset: 1, viewPosition: 0.2 })

                                // }
                            }}>
                                <Text style={styles.titleStyle}>{item.title}</Text>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
        )
    }

    function renderListItem({ item, index }) {

        if (!item.newList.length) return null;

        return (
            <View style={{ marginVertical: 20 }}>
                <Text style={[styles.titleStyle, { paddingHorizontal: 10 }]}>{item.title}</Text>
                <FlatList
                    data={item.newList}
                    horizontal
                    contentContainerStyle={{ paddingVertical: 20 }}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={styles.itemView}>
                                <Text style={styles.titleStyle}>{item.subTitle}</Text>
                                <Text style={styles.subHeaderText}>{item.subHeader}</Text>
                                <Text style={styles.dateText}>{"Expires On:: "} {item.expireDate}</Text>
                                <Text style={styles.dateText}>{"Status:: "} {item.status}</Text>
                            </View>
                        )
                    }}
                />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {/* <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingVertical: 10 }}

      > */}
            {/* <View style={styles.topView}>
        <Text style={styles.nameText}>{"Hello Loren Ipsum"}</Text>
        <Text style={styles.simpleText}>{"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."}</Text>
      </View> */}

            <FlatList
                ListHeaderComponent={renderHeaderComponent}
                data={ticketList}
                // getItemLayout={(data, index) => {
                //   console.log("Data--->", data)
                //   console.log("index--->", index)
                // }}
                stickyHeaderIndices={[0]}
                // StickyHeaderComponent={renderHeaderComponent}
                ref={flatListRef}
                keyExtractor={(i, j) => j.toString()}
                extraData={ticketList}
                bounces={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, paddingVertical: 10, }}
                renderItem={renderListItem}
            />
            {/* </ScrollView> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    nameText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "black"
    },
    topView: {
        marginHorizontal: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1
    },
    simpleText: {
        fontSize: 12,
        color: "black",
        paddingVertical: 5
    },
    titleStyle: {
        color: "black",(index + (index + 1)),
},
    titleView: {
    borderWidth: 1,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 5
},
    itemView: {
    borderWidth: 1,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 10
},
    subHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black"
},
    dateText: {
    fontSize: 14,
    color: "gray",
    paddingTop: 15
}
})