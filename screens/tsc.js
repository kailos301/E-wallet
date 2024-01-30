/**
 * Created by januslo on 2018/12/26.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    Button
} from 'react-native';
import {BluetoothTscPrinter} from "react-native-bluetooth-escpos-printer";


export default class Tsc extends Component {
    _listeners = [];

    constructor(props) {
        super(props);
        this.state = {
            boundAddress: props.boundAddress,
            boundName: props.boundName,
            loading: false
        }
    }

    componentDidMount() {//alert(BluetoothManager)

    }

    render() {
        return <View style={{flex: 1}}>

            <View style={styles.btn}>
                <Button onPress={() => {
                    this.props.navigator.pop();
                }} title="&lt;= Back To Pre"/>
            </View>

            <View style={styles.btn}>
                <Button
                    title="Print Label" onPress={() => {
                    BluetoothTscPrinter.printLabel(
                        {
                            width: 40,
                            height: 30,
                            gap: 20,
                            direction: BluetoothTscPrinter.DIRECTION.FORWARD,
                            reference: [0, 0],
                            tear: BluetoothTscPrinter.TEAR.ON,
                            sound: 1,
                            text: [{
                                text: 'I am a testing txt',
                                x: 20,
                                y: 0,
                                fonttype: BluetoothTscPrinter.FONTTYPE.SIMPLIFIED_CHINESE,
                                rotation: BluetoothTscPrinter.ROTATION.ROTATION_0,
                                xscal: BluetoothTscPrinter.FONTMUL.MUL_1,
                                yscal: BluetoothTscPrinter.FONTMUL.MUL_1
                            }, {
                                text: '你在说什么呢?',
                                x: 20,
                                y: 50,
                                fonttype: BluetoothTscPrinter.FONTTYPE.SIMPLIFIED_CHINESE,
                                rotation: BluetoothTscPrinter.ROTATION.ROTATION_0,
                                xscal: BluetoothTscPrinter.FONTMUL.MUL_1,
                                yscal: BluetoothTscPrinter.FONTMUL.MUL_1
                            }],
                            qrcode: [{
                                x: 20,
                                y: 96,
                                level: BluetoothTscPrinter.EEC.LEVEL_L,
                                width: 3,
                                rotation: BluetoothTscPrinter.ROTATION.ROTATION_0,
                                code: 'show me the money'
                            }],
                            barcode: [{
                                x: 120,
                                y: 96,
                                type: BluetoothTscPrinter.BARCODETYPE.CODE128,
                                height: 40,
                                readable: 1,
                                rotation: BluetoothTscPrinter.ROTATION.ROTATION_0,
                                code: '1234567890'
                            }]
                        }
                    ).then(() => {
                        alert("done")
                    }, (err) => {
                        alert(err)
                    });

                }
                }/>
            </View>

        </View>
    }
}


const styles = StyleSheet.create({
    btn: {
        marginBottom: 8
    },
});