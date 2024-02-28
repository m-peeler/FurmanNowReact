import {View, StyleSheet, FlatList, Text} from "react-native"
import Button from "../components/Button";
import { useTheme } from "@react-navigation/native";

export default function Feed(props) {

    function buttonColor(pressed) {
        return pressed ? colors.notification : colors.card;
    }
    function buttonTextColor(pressed) {
        return pressed ? colors.notificationText : colors.text;
    }

    const news = props.route.params.pages;
    const perRow = 2;
    const {colors, fonts} = useTheme();

    const buttonStyles = StyleSheet.create({
        buttonLabel: {
            color: colors.text,
            textAlign: "center",
            fontFamily: fonts.heading,
            fontSize: 18,
        },
        buttonDesign: {
            button: {
                width: "90%",
                height: "90%", 
                backgroundColor: buttonColor,
                color: buttonTextColor,
                borderRadius: 10,
            },
            cells: {
                width: "50%",
                alignContent: "center",
                justifyContent: "center",
            }
        },
    });
    
    const styles = StyleSheet.create({
        container: {
        },
        text: {
            color: colors.text,
            textAlign: "center"
        }
    })

    console.log(news);

    return (
        <View style={{flex: 1, height: "100%", alignContent: "center", padding:10}}>
            <FlatList 
                data={news} 
                numColumns={perRow}
                scrollEnabled={false}
                renderItem={({item}) => 
                    <Button
                        front= {<Text style={buttonStyles.buttonLabel}>
                                {item.name}
                            </Text>}
                        styles= {buttonStyles.buttonDesign}
                        onPress={() => 
                            props.navigation.navigate(item.name)}
                    />} 
            />
        </View>
    )
}

