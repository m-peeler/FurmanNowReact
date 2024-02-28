import Button from "./Button";
import { View, Text, StyleSheet, Alert, Platform } from "react-native";
import { isAllDay, addToCalendar } from "../utilities/DateTimeFunctions";
import * as Calendar from "expo-calendar";

export default AthleticsButton = ({colors, fonts, item}) => { 

    const [status, requestPermissions] = Calendar.useCalendarPermissions();
    item.eventNameString = `Furman ${item.sportTitle} ${locIndText(item.location_indicator)} ${item.opponent}`;

    return (
        <Button
            front={AthleticsFront(item)}
            frontResponsive={true}
            onLongPress={() => requestAddEvent(setupEventData(item), status, requestPermissions)}
            styles={makeStyles(colors, fonts, item.location_indicator == "H")}
            accessibilityLabel={generateAccessibilitySummary(item)}
            accessibilityHint= {"Click for more information."}
        />
    )
}

function setupEventData(item) {
    const event = {
        title: item.eventNameString,
        startDate: item.eventdate,
        endDate: new Date(item.eventdate.getTime() + (2 * 60 * 60 * 1000)),
        location: item.location,
        allDay: item.allDay,
        timeZone: "America/New_York",
        notes: `Go Furman ${item.sportTitle}! Roll Dins!`,
        availability: Calendar.Availability.BUSY,
    }
    return event;
}

function requestAddEvent(event, status, requestPermissions) {
        Alert.alert("Add Event?",
            `Would you like to add ${event.title} to your calendar?`,
            [
                {text: "Cancel", onPress: () => {}},
                {text: "Ok", onPress: () => addToCalendar(event, status, requestPermissions), isPreferred: true}
            ]
        )
}

function AthleticsFront(item) {
    return (styles) => {
        return (
            <View>
                <View style={{flexDirection: "row"}}>
                    <Text style={styles.title}>{item.sportTitle}</Text>
                    <Text style={styles.versus}>
                        {`${formatOpponent(item)}`}
                    </Text>
                </View>
                <View style={{flexDirection: "row"}}>
                    {item.noplayText != "" &&
                        <Text style={styles.cancelled}>{item.noplayText}</Text>
                    }  
                    {item.resultStatus != "" &&
                        <Text style={styles.victory}>{victoryMessage(item)}</Text>
                    }
                    <Text style={styles.info}>{formatDatetime(item.eventdate)}</Text>
                </View>
            </View>
        )
    }
}


function victoryMessage(item) {
    switch (item.resultStatus) {
        case "L":
            return `Loss: ${item.resultUs} to ${item.resultThem}`;
        case "W":
            return `Win: ${item.resultUs} to ${item.resultThem}`;
        default:
            return `${item.resultUs}-${item.resultThem}`;
    }
}


function formatOpponent(item) {
    switch (item.location_indicator){
        case "A":
            return `@ ${item.opponent}`;
        case "H":
            return `vs. ${item.opponent}`;
        default:
            return `${item.opponent}`
    }
}  

function makeStyles(colors, fonts, home) {
    return (pressed) => {
        return StyleSheet.create({
            button: buttonStyles(colors, fonts, home, pressed),
            front: frontStyles(colors, fonts, home, pressed)
        })
    }
}

function buttonStyles(colors, fonts, home, pressed) {
        return StyleSheet.create({
            backgroundColor: 
                pressed ?
                    colors.notification : 
                    home ? colors.accentCard : colors.card,
            color: 
                pressed ? 
                    colors.notificationText : 
                    home ? colors.accentText : colors.text,
            borderRadius: 5,
            margin: 2,
            padding: 6
        })
    };

function frontStyles(colors, fonts, home, pressed) {
        let sty = buttonStyles(colors, fonts, home, pressed);
        return StyleSheet.create({
            ...sty,
            title: {
                flex: 4,
                fontFamily: fonts.bold,
                fontSize: 24,
                color: sty.color,
            },
            versus: {
                flex: 2,
                fontFamily: fonts.italic,
                fontSize: 16,
                color: sty.color,
                textAlign: "right",
                alignSelf: "flex-end"
            },
            info: {
                fontFamily: fonts.bold,
                fontSize: 16,
                color: sty.color,
                flex: 1,
                textAlign: "right",
                marginRight: 10
            },
            cancelled: {
                fontFamily: fonts.italic,
                fontSize: 16,
                marginLeft: 10,
                color: pressed ? colors.emergencyText : colors.negative
            }, 
            victory: {
                fontFamily: fonts.italic,
                fontSize: 16,
                color: sty.color,
                alignContent: "center",
                marginLeft: 10,
                flex: 1
            }
    })};

function locIndText(loc_ind) {
    switch (loc_ind) {
        case "H":
            return "at Home against";
        case "A":
            return "at";
        default: 
            return "against";
    } 
}

function generateAccessibilitySummary(item) {
    let location = locIndText(item.location_indicator);
    if (item.resultStatus != "") {
        const victStatus = item.resultStatus == "W" 
                                ? "won" :  
                                item.resultStatus == "L" ?
                                    "lost" :
                                    "drew" ;
        return `The ${item.sportTitle} team ${victStatus} ${location} ${item.opponent}, with a final score of Furman ${item.resultUs} to ${item.opponent} ${item.resultThem}`;
    } else if (item.noplayText != "") {
        return `The ${item.sportTitle} game ${location} ${item.opponent} was ${item.noplayText}.`
    } else {
        return `The ${item.sportTitle} team will play ${location} ${item.opponent} ${formatDatetime(item.eventdate)}.`
    }
}

function formatDatetime(date) {
    if(date == undefined) {
        console.log("Hello", date);
        return
    }
    const month = date.toLocaleDateString("default", {month: "short"});
    const weekday = date.toLocaleDateString("default", {weekday: "short"});
    let time;
    if (isAllDay(date)) {
        time = "All Day"; 
    } else {
        let hours = date.getHours() % 12;
        let minutes = date.getMinutes();
        time = `${hours != 0 ? hours : 12}:${minutes > 10 ? minutes : "0" + minutes } ${date.getHours() > 12 && date.getHours() != 24 ? "pm" : "am"}`;
    }
    return `${time}, ${weekday}. ${month}. ${date.getDate()}`;
}