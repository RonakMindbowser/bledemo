import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function List(){

    const [ticketList, setTicketList] = useState([
        {
          title:"State License",
        },
        {
          title:""
        }
      ])

    return(
        <View style={styles.container}>
        <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow:1,paddingVertical:10}}

        >
        <View style={styles.topView}>
            <Text style={styles.nameText}>{"Hello Loren Ipsum"}</Text>
            <Text style={styles.simpleText}>{"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."}</Text>
        </View>
        </ScrollView>
      </View>
    )
}

const styles =StyleSheet.create({
    container:{
      flex:1,
      backgroundColor:"white"
    },
    nameText:{
      fontSize:16,
      fontWeight:"bold",
      color:"black"
    },
    topView:{
      marginHorizontal:20,
      paddingHorizontal:20,
      paddingVertical:10,
      borderRadius:10,
      borderWidth:1
    },
    simpleText:{
      fontSize:12,
      color:"black",
      paddingVertical:5
    }
  })