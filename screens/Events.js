import { useTheme } from "@react-navigation/native"
import {Dimensions, SafeAreaView, StyleSheet, Text} from "react-native"
import useDataLoadFetchCache from "../hooks/useDataLoadFetchCache";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";

export default function Events({navigation, pages}) {
    const headerHeight = useHeaderHeight();
    const {bottom : bottomHeight} = useSafeAreaInsets();
    const displayableHeight = Dimensions.get("window").height - headerHeight - bottomHeight;

    const {colors, fonts} = useTheme();
    const [data, loading, fetching] = 
        useDataLoadFetchCache(
            "https://cs.furman.edu/~csdaemon/FUNow/clpGet.php",
            "DATA:Events-Cache",
            processFetch = (data) => data
        )

    const style = StyleSheet.create({
        fontFamily: fonts.bold,
        color: colors.text
    });

    return (
        <SafeAreaView>
            {(!loading || !fetching) && 
                
                <Text style={style}>{data.results.map((item) => `${item.title} \t ${item.date}\n`)}</Text>}
        </SafeAreaView>
    )
}

