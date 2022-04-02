import React from 'react';
import { Text, View } from 'react-native';
import {
    CustomLoader,
    CustomButton,
    CustomHeader,
    scale,
    verticalScale,
    moderateScale,
    multiply,
    add,
    showSimpleAlert,
    isValidEmail,
    isValidPassword,
    getFileExtension
} from "react-native-reusable-custom-components";

const ReusbleComponentDemo = () => {

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <CustomHeader
                backButton={true}
                middleText={'Reusble Header'}
            />
        </View>
    )
}

export default ReusbleComponentDemo;
