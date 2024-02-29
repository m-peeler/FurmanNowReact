import {SafeAreaView, View, StyleSheet, Text, Dimensions} from "react-native";
import {FlashList} from "@shopify/flash-list";
import Button from "../components/Button";
import {useTheme} from "@react-navigation/native";
import {renderHSNavButton} from "../components/HomeScreenNavButton";
import {useHeaderHeight} from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen(props) {
    const {colors, fonts} = useTheme();
    const windowHeight = Dimensions.get("window").height;

    const buttonStyles = StyleSheet.create({
        label: {
            flex: 1,
            color: colors.text,
            textAlign: "center",
            fontFamily: fonts.bold,
            fontSize: 18,
            padding: 10,
        },
        buttonStyles: (pressed) => {
            return {
                button: {
                    width: windowHeight / 7 * .8,
                    height: windowHeight / 7 * .8,
                    backgroundColor: buttonColor(pressed),
                    color: buttonTextColor(pressed),
                    borderRadius: 10,
                },
                cells: {
                    flex: 1,
                    width: "33.333%",
                    alignItems: "center" 
                }
            }
        },
    })

    const newsStyles = (pressed) => StyleSheet.create({
        front: {
            label: {
                textAlign: "center",
                fontFamily: fonts.heading,
                padding: 30,
                fontSize: 40,
                color: buttonTextColor(pressed)
            }
        },
        button: {
            backgroundColor: buttonColor(pressed),
            color: buttonTextColor(pressed), 
            borderRadius: 20,
        },
        cells: {
            paddingHorizontal: 10,
            marginBottom: 10
        }
})

    const headerHeight = useHeaderHeight();
    const {bottom : bottomHeight} = useSafeAreaInsets();
    const displayableHeight = Dimensions.get("window").height - headerHeight - bottomHeight;
    const pages = props.route.params.pages;

    const styles = StyleSheet.create({
        container: {
            backgroundColor: colors.background,
            alignItems: "center"
        },
        headings: {
            fontSize: 18,
            textAlign: "center",
            color: colors.text,
            alignContent: "center",
            justifyContent: "center",
        },
        weather: {
            flexDirection: "row",
            backgroundColor: colors.card,
            alignSelf: "flex-start",
            alignContent: "center",
            justifyContent: "center",
            borderBottomRightRadius: 15,
            borderBottomLeftRadius: 15,
            top: -10,
            width: "100%",
            height: displayableHeight / 7 * 2,
        }
    })

    function buttonColor(pressed) {
        return pressed ? colors.notification : colors.card;
    }
    function buttonTextColor(pressed) {
        return pressed ? colors.notificationText : colors.text;
    }

    const  renderResponsiveLabel = (text) => (style) => {
        return  (
            <Text style={style.label}>
                {text}
            </Text>
        );
    }

    return (
        <SafeAreaView style={{flex: 1, flexDirection: "column"}}>
            <View style={styles.weather}>
                <Text style={{alignSelf: "flex-end",
                                fontFamily: fonts.bold, 
                                paddingBottom:10,
                                fontSize: 20,
                                color: buttonTextColor(false)}}
                        >Weather</Text>
            </View>
            <View style={{height: displayableHeight / 7 * 4}}/>
            <View style={{alignSelf: "flex-end", height: displayableHeight / 7, width: "100%"}}>
                <Button 
                    accessibilityLabel = "News Feed"
                    accessibilityHint = "Press to travel to the news feed"
                    front={renderResponsiveLabel("News Feed")}
                    frontResponsive={true}
                    styles={newsStyles}
                    onPress={() => props.navigation.navigate("Feed")} 
                />
        </View>
        <View style={{flex: "none", height: displayableHeight / 7 * 4, width: "100%", position: "absolute", top: displayableHeight / 7 * 2}}>
            <FlashList
                extraData={colors}
                estimatedItemSize={100}
                scrollEnabled={false}
                data={pages}
                numColumns={3}
                renderItem={
                    (p) => renderHSNavButton(buttonStyles, 
                        () => props.navigation.navigate(p.item.name))(p)
                    } 
            />
        </View>
    </SafeAreaView>
    )
}

