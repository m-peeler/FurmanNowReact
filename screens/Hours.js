import { useTheme } from "@react-navigation/native"
import {SafeAreaView, StyleSheet, Text, View} from "react-native"
import ButtonList from "../components/ButtonList";
import useBuildingHours from "../hooks/useBuildingHours";
import { useState } from "react";
import { Pressable } from "react-native";

export default function Hours(props) {
    const {colors, fonts} = useTheme();
    const [data, dataExists] = useBuildingHours();

    const styles = (pressed) => StyleSheet.create({
        front : (engaged) => {return {
            locationText: {
                title: {
                    fontFamily: fonts.bold,
                    color: pressed ? colors.notificationText : colors.text,
                    fontSize: 24,
                    flex: 2,
                    flexGrow: 1
                },
                openIndicator : (opened) => { return {
                    alignSelf: "center",
                    borderRadius:10, 
                    height:20, 
                    width: 20, 
                    margin: 5, 
                    backgroundColor: pressed 
                            ? colors.notificationText 
                            : opened ? colors.positive : colors.negative
                }}
            }, 
            dayText: {
                fontFamily: fonts.regular,
                color: pressed ? colors.notificationText : colors.text,
                fontSize: 18,
                paddingLeft: 10,
                paddingVertical: 0,
                flex: 1
            },
            hoursText: {
                fontFamily: fonts.thin,
                color: pressed ? colors.notificationText : colors.text,
                fontSize: 18,
                paddingRight: 10,
                paddingVertical: 0,
                flex: 2,
                textAlign: "right" 
            },
        }},
        button : {
            backgroundColor: pressed ? colors.notification : colors.card
        }
    })

    const HoursFront = ({styles, item, engaged}) => {
        const [key, value] = item;
        return (
            <View style={{flexDirection: "column"}}>
                <HoursTitleBar styles={styles.locationText} name={key} information={value}/>
                <View style={{flexDirection: "column"}}>
                {value.schedule.dailySchedules(!engaged).map(([day, hours]) => 
                    {
                    return (
                    <View key={day} accessible={true} 
                            accessibilityLabel={`${key}, opened ${day} from ${hours}`}
                            style={{flexDirection: "row", alignContent: "space-between"}}>
                        <Text style={styles.dayText}>{day}</Text>
                        <Text style={styles.hoursText} id={day}>{`${hours}`}</Text>
                    </View> )
                    }
                )}
                </View>
            </View> 
        );
    }

    const HoursTitleBar = ({styles, name, information}) => {
        const {colors, fonts} = useTheme();
        let opened = information.schedule.isOpened(new Date(Date.now()));
        let openedString = `${name} is currently ${opened ? "opened" : "closed"}.`
        return (
            <View accessible={true}
                   accessibilityLabel={openedString}
                    style={{flexDirection: "row", justifyContent: "space-between"}}>
                <Text style={styles.title}>{`${name.trim()}`}</Text>
                <View style={{justifyContent: "center", flexDirection:"row", flex:.5, alignContent:"center"}}>
                    <View
                        style={{padding: 3, justifyContent: "center"}}>
                        <Text style={{color: styles.title.color, fontFamily: fonts.bold}}>
                            {opened ? "OPEN" : "CLOSED"}
                        </Text>
                    </View>
                    <View style={styles.openIndicator(opened)}/>
                </View>
            </View>)
    }

    const normalStyle = {
        bounding: {
            alignSelf: "center",
            height: "97%",
            width: "95%",
            borderRadius: 10, 
            backgroundColor: colors.card, 
            marginVertical: "2.5%",
            padding: 5,
        }
    };

    const [buttonEngaged, setButtonEngaged] = useState(-1);

    const HoursButton = ({item, index}) => {
        const [pressed, setPressed] = useState(false);
        const sty = styles(pressed);
        return (
            <Pressable
                style={sty.button}
                onPress={() => {
                    setButtonEngaged(buttonEngaged == index ? -1 : index)
                }}
                onTouchStart={() => setPressed(true)}
                onTouchEnd={() => setPressed(false)}
                onTouchCancel={() => setPressed(false)}
                accessible={false}
                >
                <HoursFront styles={sty.front(buttonEngaged)} item={item} engaged={index == buttonEngaged} />
            </Pressable>
        )
    }

    return (
        <SafeAreaView style={{height:"100%", width:"100%"}}>
            {data && dataExists &&
                <ButtonList
                    extraData={buttonEngaged}
                    estimatedItemSize={200}
                    style={normalStyle}
                    sorter={((vals) => vals.sort(([k1, v1],[k2, v2]) => k1.localeCompare(k2)))}
                    data= {data}
                    renderItem={({item, index}) => <HoursButton item={item} index={index}/>}
                    keyExtractor={([key, value]) => key}
                />}
        </SafeAreaView>
    )
}