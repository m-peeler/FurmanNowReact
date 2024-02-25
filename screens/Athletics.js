import { useTheme } from "@react-navigation/native"
import {SafeAreaView, StyleSheet, Text, View} from "react-native"
import useDataLoadFetchCache from "../hooks/useDataLoadFetchCache";
import ButtonList from "../components/ButtonList";
import Button from "../components/Button";

export default function Athletics({navigation, pages}) {
    const {colors, fonts} = useTheme();
    const [data, loading, fetching] = 
        useDataLoadFetchCache(
            "https://cs.furman.edu/~csdaemon/FUNow/athleticsGet.php",
            "DATA:Athletics-Cache",
            async (data) => await data.json()
        )

    const styles = {
        button: {
            backgroundColor: (pressed) => 
                pressed ?
                    colors.notification : 
                    colors.card,
            color: (pressed) => 
                pressed ? 
                    colors.notificationText : 
                    colors.text,
            borderRadius: 5,
            margin: 2
        }
    }

    styles.front = {
        ...styles.button,
        title: {
            flex: 4,
            fontFamily: fonts.bold,
            fontSize: 24,
            color: colors.text,
        },
        versus: {
            flex: 2,
            fontFamily: fonts.italic,
            fontSize: 12,
            color: colors.text,
            textAlign: "right",
            alignSelf: "flex-end"
        },
        info: {
            fontFamily: fonts.regular,
            fontSize: 16,
            color: colors.text,
        }
    };

    const normalStyle = {
        bounding: {
            borderRadius: 10, 
            backgroundColor: colors.card, 
            marginHorizontal: 20,
            marginVertical: 5,
            marginBottom: 10,
            padding: 5
        },
        loadingText: {
            fontFamily: fonts.bold, 
            fontSize: 20,
            color: colors.text,
        },
        scrollEnabled: true,
    };

    return (
        <SafeAreaView>
            {(!loading || !fetching) && 
                <ButtonList
                    data={data.results}
                    keyExtractor = {(item) => item["id"].toString()}
                    style={normalStyle}
                    renderItem= {renderItem(styles)}
                    sorter= {(vals) => 
                        vals.sort((a,b) => a.eventdate.localeCompare(b.eventdate))
                        }

                />}
        </SafeAreaView>
    )
}

const renderItem = (styles) => ({item}) => {
    return (
        <Button
            front={renderFront(item, styles.front)}
            frontResponsive={true}
            styles={styles}
        />
    )
}

const renderFront = (item, styles) => (pressed) => {
    return (
        <View>
            <View style={{flexDirection: "row"}}>
                <Text style={styles.title}>{item.sportTitle}</Text>
                <Text style={styles.versus}>
                    {`${formatOpponent(item)}`}
                </Text>
            </View>
            <Text style={styles.info}>{item.eventdate}</Text>
        </View>
    )
}

function formatOpponent(item) {
    switch (item.location_indicator){
        case "A":
            return `@ ${item.opponent}`
        default:
            return `vs. ${item.opponent}`
    }
}  