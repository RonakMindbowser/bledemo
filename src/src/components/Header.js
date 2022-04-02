import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
// import Add from '../assets/svg/Add';
// import Menu from '../assets/svg/Menu';
// import Search from '../assets/svg/Search';

const Header = (props) => {
  const { headerHeight } = props;
  return (
    <>
      <View
        style={[
          styles.subHeader,
          {
            height: headerHeight / 2,
          },
        ]}>
        {/* <Menu /> */}
        {/* <Text style={styles.conversation}>Conversations</Text> */}
        <View style={styles.topView}>
          <Text style={styles.nameText}>{"Hello Loren Ipsum"}</Text>
          <Text style={styles.simpleText}>{"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."}</Text>
        </View>

        {/* <Add /> */}
      </View>
      <View
        style={[
          styles.subHeader,
          {
            height: headerHeight / 2,
          },
        ]}>
        <View style={styles.searchBox}>
          {/* <Search /> */}
          <Text style={styles.searchText}>Search for messages or users</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  subHeader: {
    width: '100%',
    paddingHorizontal: 10,
    backgroundColor: '#1c1c1c',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conversation: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  searchText: {
    color: '#8B8B8B',
    fontSize: 17,
    lineHeight: 22,
    marginLeft: 8,
  },
  searchBox: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#0F0F0F',
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
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
});
export default Header;
