import React, { Component, useRef, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity,
    SectionList as RNSectionList
} from 'react-native';

export default function RNApp() {

    const [dataSourceCords, setDataSourceCords] = useState([]);
    const [ref, setRef] = useState(null);

    const [pendingTaskList, setPendingTaskList] = useState([
        {
            title: "30 Jan 2021",
            taskRemain: 0,
        },
        {
            title: "15 Jan 2021",
            taskRemain: 5,
        },
        {
            title: "10 Jan 2021",
            taskRemain: 10,
        },
        {
            title: "22 Feb 2021",
            taskRemain: 3,
        },
        {
            title: "30 July 2021",
            taskRemain: 6,
        },
    ])

    const [ticketList, setTicketList] = useState([
        {
            title: "State License",
            data: [
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
            title: "Pending License",
            data: [
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
            data: [
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
            data: [
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
            data: [
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
            <View style={styles.headerView}>
                <FlatList
                    horizontal
                    data={ticketList}
                    bounces={false}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 10, paddingVertical: 10 }}
                    renderItem={({ item, index }) => {
                        if (!item.data.length) return null;
                        return (
                            <TouchableOpacity style={styles.titleView} onPress={() => {
                                console.log(dataSourceCords, index);
                                if (index == 0) {
                                    let scrollObj = {
                                        x: 0,
                                        y: dataSourceCords[index] - dataSourceCords[index] / 3,
                                        animated: true,
                                    }
                                    console.log("scrollObj--->", scrollObj)
                                    ref.scrollTo(scrollObj);
                                }
                                else {
                                    let scrollObj = {
                                        x: 0,
                                        y: dataSourceCords[index] - dataSourceCords[index - 1] / (index + (index + 1)),
                                        // y: dataSourceCords[index] - dataSourceCords[index - 1] / 3,
                                        animated: true,
                                    }
                                    console.log("scrollObj--->", scrollObj)
                                    ref.scrollTo(scrollObj);
                                }
                            }}>
                                <Text style={styles.titleStyle}>{item.title}</Text>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
        )
    }

    function renderListItem(item, index,) {
        console.log("Item--->", item);
        console.log("index--renderItem->", index);

        if (!item.data.length) return null;

        return (
            <View style={{ marginVertical: 20 }}
                key={index}
                onLayout={(event) => {
                    const layout = event.nativeEvent.layout;
                    console.log('layout:', layout);
                    dataSourceCords[index] = layout.y;
                    setDataSourceCords(dataSourceCords);
                    console.log(dataSourceCords);
                }}
            >
                <Text style={[styles.titleStyle, { paddingHorizontal: 10 }]}>{item.title}</Text>
                <FlatList
                    data={item.data}
                    horizontal
                    contentContainerStyle={{ paddingVertical: 20 }}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={styles.itemView} >
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

    function renderHeaderListItem({ item, index }) {
        return (
            <View style={{ marginTop: 10 }}>
                <Text style={styles.titleStyle}>{item.title}</Text>
                <Text style={[styles.dateText, { paddingTop: 0 }]}>{"Status:: "} {item.taskRemain}</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <ScrollView
                bounces={false}
                stickyHeaderIndices={[1]}
                ref={(ref) => { setRef(ref); }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 10 }}
            >
                <View style={styles.topView}>
                    <Text style={styles.nameText}>{"Hello Loren Ipsum"}</Text>
                    <Text style={styles.simpleText}>{"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."}</Text>
                    {/* <FlatList
                        data={pendingTaskList}
                        bounces={false}
                        showsVerticalScrollIndicator={false}
                        renderItem={renderHeaderListItem}
                    /> */}
                </View>
                {renderHeaderComponent()}
                {
                    ticketList.map(renderListItem)
                }
            </ScrollView>
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
        color: "black",
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
    },
    headerView: {
        flex: 1,
        paddingVertical: 15,
        backgroundColor: "white",
        borderWidth: 1,
        marginTop: 5
    }
})