import { useTheme } from "@react-navigation/native";
import { SafeAreaView, StyleSheet, View } from "react-native";
import MapView from "react-native-maps";

export default function FUNowMapView(props) {
    const {colors, fonts} = useTheme();
    let {zoom} = props;
    if (zoom != undefined && zoom != 0) {
        zoom = 1 / zoom;
    } else {
        zoom = 1;
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "flex-end",
            alignItem: "center",
        }, map: { 
            ...StyleSheet.absoluteFillObject,
            borderRadius: 12,
            margin: 6
        },
        bounding: {
            paddingHorizontal: 6,
            paddingVertical: 4,
            flex: 1,
            backgroundColor: colors.card,
            justifyContent: "flex-end",
            margin: 10,
            borderRadius: 16
        }
    })


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.bounding}>
                <MapView 
                    style={styles.map}
                    maxZoomLevel={18}
                    initialRegion={{
                        latitude: 34.925,
                        longitude: -82.440,
                        latitudeDelta: zoom * 0.0012,
                        longitudeDelta: zoom * 0.006
                }}>
                    
                    {props.children}
                </MapView>
            </View>
        </SafeAreaView>
    )
}