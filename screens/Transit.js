import { useTheme } from "@react-navigation/native"
import {StyleSheet, Dimensions} from "react-native"
import useDataLoadFetchCache from "../hooks/useDataLoadFetchCache";
import FUNowMapView from "../components/CustomMapView";

export default function Transit(props) {
    const {colors, fonts} = useTheme();
    const [shuttleData, shuttleLoad, shuttleFetch] = 
        useDataLoadFetchCache(
            "https://cs.furman.edu/~csdaemon/FUNow/shuttleGet.php",
            "DATA:Shuttle-Cache",
            processFetch = async (data) => await data.json(),
        )

    const [stopsData, stopsLoad, stopsFetch] = 
        useDataLoadFetchCache(
            "https://cs.furman.edu/~csdaemon/FUNow/busStopsGet.php",
            "DATA:Bus-Stops-Cache",
            processFetch = async (data) => await data.json()
        )

    return (
        <FUNowMapView 
            zoom={0.5}
        />
    )
}