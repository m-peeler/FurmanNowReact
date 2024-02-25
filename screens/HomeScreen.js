import {SafeAreaView, View, StyleSheet, Text, FlatList, Dimensions} from "react-native";
import Button from "../components/Button";
import {useTheme} from "@react-navigation/native";

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
        buttonDesign: {
            button: {
                width: windowHeight / 7 * .8,
                height: windowHeight / 7 * .8,
                backgroundColor: buttonColor,
                color: buttonTextColor,
                borderRadius: 10,
            },
            cells: {
                flex: 1,
                width: "33.333%",
                alignItems: "center" 
            }
        },
    })

    const newsStyles = StyleSheet.create({
        label: {
            textAlign: "center",
            fontFamily: fonts.heading,
            padding: 30,
            fontSize: 40,
        },
        buttonDesign: {
            button: {
                width: "100%",
                backgroundColor: buttonColor,
                color: buttonTextColor, 
                borderRadius: 20},
             cells: {
                paddingHorizontal: 10,
                paddingBottom: 5
             }
        },
    })

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: "row",
            backgroundColor: colors.background,
            alignContent: "center",
            justifyContent: "center",
        },
        headings: {
            fontSize: 18,
            textAlign: "center",
            color: colors.text,
            alignContent: "center",
            justifyContent: "center",
        },
        weather: {
            flex: 1.5,
            flexDirection: "row",
            backgroundColor: colors.card,
            alignContent: "center",
            justifyContent: "center",
            borderBottomRightRadius: 15,
            borderBottomLeftRadius: 15,
            width: "100%",
        }
    })

    function buttonColor(pressed) {
        return pressed ? colors.notification : colors.card;
    }
    function buttonTextColor(pressed) {
        return pressed ? colors.notificationText : colors.text;
    }

    const renderNavButtons = (styles) => ({item}) => {
        return (
            <Button
                accessibilityLabel=
                    {item.name}
                accessibilityHint=
                    {`Press to travel to the ${item.name} page.`}
                under={<Text
                        accessible= {true}
                        accessibilityLabel= {`${item.name}, title`}
                        style= {buttonStyles.label}>
                            {item.name}
                        </Text>}
                front={<View/>}
                styles={buttonStyles.buttonDesign}
                onPress={() => 
                    props.navigation.navigate(item.page)}
            /> 
        )
    }

    const  renderResponsiveLabel = (text, style) => (pressed) => {
        return  (
            <Text style={[style, {
                backgroundColor: "#00000000", 
                color: buttonTextColor(pressed)}]}>
                {text}
            </Text>
        );
    }


    const pages = props.route.params.pages;
    return (
        <View style={[
            styles.container,
                {flex: 1,
                    flexDirection: "column"},
                    ]}>
            <SafeAreaView style={styles.weather}>
                <Text style={{alignSelf: "flex-end",
                                fontFamily: fonts.bold, 
                                paddingBottom:10,
                                fontSize: 20,
                                color: buttonTextColor(false)}}
                        >Weather</Text>
            </SafeAreaView>
            <View style={{marginTop: 10, flex: 4}}>
                <FlatList
                    style={{}}
                    scrollEnabled={false}
                    data={pages}
                    numColumns={3}
                    renderItem={renderNavButtons(buttonStyles)} 
                />
            </View>
            <SafeAreaView style={{flex: 1}}>
                <Button 
                    accessibilityLabel = "News Feed"
                    accessibilityHint = "Press to travel to the news feed"
                    front={renderResponsiveLabel("News Feed", newsStyles.label)}
                    frontResponsive={true}
                    styles={newsStyles.buttonDesign}
                    onPress={() => props.navigation.navigate("Feed")} 
                />
            </SafeAreaView>
        </View>
    )
}

