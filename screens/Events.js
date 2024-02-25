import { useTheme } from "@react-navigation/native"
import {SafeAreaView, StyleSheet, Text} from "react-native"
import useDataLoadFetchCache from "../hooks/useDataLoadFetchCache";

export default function Events({navigation, pages}) {
    const {colors, fonts} = useTheme();
    const [data, loading, fetching] = 
        useDataLoadFetchCache(
            "https://cs.furman.edu/~csdaemon/FUNow/clpGet.php",
            "DATA:Events-Cache",
            processFetch = async (data) => await data.json()
        )

    const style = StyleSheet.create({
        fontFamily: fonts.bold,
        color: colors.text
    })

    return (
        <SafeAreaView>
            {(!loading || !fetching) && 
                <Text style={style}>{data.results.map((item) => `${item.title} \t ${item.date}\n`)}</Text>}
        </SafeAreaView>
    )
}