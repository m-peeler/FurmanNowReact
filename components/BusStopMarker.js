import {Callout, Marker} from "react-native-maps";
import {StyleSheet, Text, View} from "react-native"

export default function BusStopMarker(props) {
    return (
        <Marker
            coordinate={props.coordinate}
            flat={true}
        >
            <View style={{borderColor: props.color, borderWidth: 5, backgroundColor: "#ffffff", height: 30, width: 30, borderRadius: 20}}></View>
            <Callout tooltip={true}>
                <View>
                    <View style={{borderColor: "#ffffff", borderWidth: 5, borderRadius: 5, backgroundColor: "#ffffff", flex: 1, width: "100%"}}>
                        <Text style={{flex: 1, padding:10}}>{props.title}</Text>
                    </View>
                    <View style={{borderRadius: 5, width: 10, height: 10, backgroundColor: "#ffffff", top: -5, left: 20, bottomPadding: -5}}/>
                </View>
            </Callout>
        </Marker>
    )
}