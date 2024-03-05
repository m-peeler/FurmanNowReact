import { useTheme } from "@react-navigation/native"
import {SafeAreaView, StyleSheet, Text} from "react-native"
import useDataLoadFetchCache from "../hooks/useDataLoadFetchCache";

export default function Health(props) {
    const {colors, fonts} = useTheme();
    const [data, loading, fetching] = 
        useDataLoadFetchCache(
            "https://cs.furman.edu/~csdaemon/FUNow/healthSafetyGet.php",
            "DATA:Health-Safety-Cache",
            (data) => data
        )

    const style = StyleSheet.create({
        fontFamily: fonts.bold,
        color: colors.text
    })

    return (
        <SafeAreaView>
            {(!loading || !fetching) && 
                <Text style={style}>{data.results.map((item) => `${item.name} \t ${item.content}\n`)}</Text>}
        </SafeAreaView>
    )
}