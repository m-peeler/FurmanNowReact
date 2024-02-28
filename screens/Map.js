import { useTheme } from "@react-navigation/native"
import {StyleSheet} from "react-native"
import useDataLoadFetchCache from "../hooks/useDataLoadFetchCache";
import FUNowMapView from "../components/CustomMapView";

export default function Map(props) {
    const {colors, fonts} = useTheme();
    const [data, loading, fetching] = 
        useDataLoadFetchCache(
            "https://cs.furman.edu/~csdaemon/FUNow/buildingGet.php",
            "DATA:Building-Map-Info-Cache",
            processFetch = async (data) => await data.json(),
        )

    const style = StyleSheet.create({
        fontFamily: fonts.bold,
        color: colors.text
    });

    return (
        <FUNowMapView />
    )
}