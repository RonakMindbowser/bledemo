/**
 * Sample React Native Share Extension
 * @flow
 */

import React, { Component } from 'react'
import ShareExtension from 'react-native-share-extension'
import Modal from './ModalBox'

import {
    Text,
    TextInput,
    View,
    TouchableOpacity,
    Image,
} from 'react-native'

export default class HandleShareComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: true,
            type: '',
            value: ''
        }
    }

    async componentDidMount() {
        try {
            const { type, value } = await ShareExtension.data()
            console.log("share data--->", type, value);
            this.setState({
                type,
                value
            })
        } catch (e) {
            console.log('errrr', e)
        }
    }

    onClose() {
        ShareExtension.close()
    }

    closing = () => {
        this.setState({
            isOpen: false
        })
    }

    render() {
        return (
            <Modal
                backdrop={false}
                style={{ backgroundColor: 'transparent' }}
                position="center"
                isOpen={this.state.isOpen}
                onClosed={this.onClose}
            >
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <View style={{
                        borderColor: 'green', borderWidth: 1,
                        backgroundColor: 'white', height: 400, width: 300,
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <TouchableOpacity onPress={this.closing}>
                            <Text style={{ color: "black" }}>Close</Text>
                            <Text style={{ color: "red", marginVertical: 10 }}>type: {this.state.type}</Text>
                            {/* <Text style={{ color: "blue" }}>value: {this.state.value}</Text> */}
                            {
                                this.state.type.includes("image") ?
                                    <Image
                                        resizeMode='contain'
                                        source={{ uri: this.state.value }} style={{ height: 200, width: 200 }} />
                                    :
                                    <Text style={{ color: "blue" }}>value: {this.state.value}</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }
}