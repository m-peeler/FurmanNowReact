import { useTheme } from "@react-navigation/native"
import {SafeAreaView, StyleSheet, Text, View} from "react-native"
import ButtonList from "../components/ButtonList";
import useBuildingHours from "../hooks/useBuildingHours";
import { useState } from "react";
import Button from "../components/Button";

export default function Hours(props) {
    const {colors, fonts} = useTheme();
    const data = useBuildingHours();

    const style = StyleSheet.create({
        locationText: {
            title: {
                fontFamily: fonts.bold,
                color: colors.text,
                fontSize: 24,
            }
        }, 
        dayText: {
            fontFamily: fonts.regular,
            color: colors.text,
            fontSize: 18,
            paddingLeft: 10,
            paddingVertical: 0,
            flex: 1
        },
        hoursText: {
            fontFamily: fonts.thin,
            color: colors.text,
            fontSize: 18,
            paddingRight: 10,
            paddingVertical: 0,
            flex: 2,
            textAlign: "right" 
        }
    })

    const HoursFront = ({item, engaged}) => {
        const [key, value] = item;
        return (
            <View style={{flexDirection: "column"}}>
                <HoursTitleBar styles={style.locationText} name={key} information={value}/>
                <View style={{flexDirection: "column"}}>
                {value.schedule.dailySchedules(!engaged).map(([day, hours]) => 
                    {
                    return (
                    <View key={day} accessible={true} 
                            accessibilityLabel={`${key}, opened ${day} from ${hours}`}
                            style={{flexDirection: "row", alignContent: "space-between"}}>
                        <Text style={style.dayText}>{day}</Text>
                        <Text style={style.hoursText} id={day}>{`${hours}`}</Text>
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
                <Text style={styles.title}>{`${name}`}</Text>
                <View
                    style={{padding: 3, borderRadius: 10, borderWidth: 5, borderColor: opened ? colors.positive : colors.negative, justifyContent: "center"}}>
                    <Text style={{color: colors.text, fontFamily: fonts.bold}}>
                        {opened ? "OPEN" : "CLOSED"}
                    </Text>
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
        },
        loadingText: {
            fontFamily: fonts.bold, 
            fontSize: 20,
            color: colors.text,
        },
        scrollEnabled: true,
    };

    const [buttonEngaged, setButtonEngaged] = useState(-1);

    const renderHours = ({item, index}) => {

        return (
            <Button 
                styles={{}}
                onPress={() => {
                    setButtonEngaged(buttonEngaged == index ? -1 : index)
                }}
                front={<HoursFront item={item} engaged={index == buttonEngaged} />}
            />
        )
    }

    return (
        <SafeAreaView style={{height:"100%", width:"100%"}}>
            {{data} &&
                <ButtonList
                    extraData={buttonEngaged}
                    estimatedItemSize={200}
                    style={normalStyle}
                    sorter={((vals) => vals.sort(([k1, v1],[k2, v2]) => k1.localeCompare(k2)))}
                    data= {data}
                    renderItem={renderHours}
                    keyExtractor={([key, value]) => key}
                />}
        </SafeAreaView>
    )
}