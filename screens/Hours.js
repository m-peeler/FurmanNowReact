import { useTheme } from "@react-navigation/native"
import {SafeAreaView, StyleSheet, Text, View} from "react-native"
import useDataLoadFetchCache from "../hooks/useDataLoadFetchCache";
import { useEffect, useState } from "react";
import ButtonList from "../components/ButtonList";

export default function Hours({navigation, pages}) {
    const {colors, fonts} = useTheme();

    const [hoursData, hoursLoad, hoursFetch] = 
        useDataLoadFetchCache(
            "https://cs.furman.edu/~csdaemon/FUNow/hoursGet.php",
            "DATA:Building-Hours-Cache",
            async (d) => {
                let json = await d.json();
                let hours = {};
                for (item of json.results) {
                    if (item.buildingID in hours) {
                        hours[item.buildingID].push(item);
                    } else {
                        hours[item.buildingID] = [item];
                    }
                }
                return hours;
            }
        )

    const [buildingData, buildingLoad, buildingFetch] = 
        useDataLoadFetchCache(
            "https://cs.furman.edu/~csdaemon/FUNow/buildingGet.php",
            "DATA:Building-Info-Cache",
            async (d) => {
                let json = await d.json();
                let buildings = {};
                for (item of json.results) {
                    buildings[item.buildingID] = item;
                }
                return buildings;
            }
        )

    const [data, setData] = useState([]);

    useEffect(() => {
        setData(joinBuildingInfo(hoursData, buildingData))
    }, [(!hoursLoad || !hoursFetch) && (!buildingLoad || !buildingFetch),
        !hoursFetch && (!buildingLoad || !buildingFetch),
        (!hoursLoad || !hoursFetch) && !buildingFetch])

    const style = StyleSheet.create({
        locationText: {
            fontFamily: fonts.bold,
            color: colors.text,
            fontSize: 24,
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
            fontFamily: fonts.regular,
            color: colors.text,
            fontSize: 18,
            paddingRight: 10,
            paddingVertical: 0,
            flex: 2.5           
        }
    })

    const renderHours = ({item}) => {
        const [key, value] = item;
        return (
            <View>
                <Text style={style.locationText}>{`${key}`}</Text>
                {value.hours.map(([key, hours, hoursString]) => 
                    <View style={{flexDirection: "row"}}>
                        <Text style={style.dayText}>{key}</Text>
                        <Text style={style.hoursText} id={key}>{`${hoursString}`}</Text>
                    </View>
                )}
            </View>
        );
    }

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
            {(!hoursLoad || !hoursFetch) &&
             (!buildingLoad || !buildingFetch) && 
             {data} &&
                <ButtonList
                    style={normalStyle}
                    sorter={((vals) => vals.sort(([k1, v1],[k2, v2]) => k1.localeCompare(k2)))}
                    data= {data}
                    renderItem={renderHours}
                    keyExtractor={([key, value]) => value.id + value.day + value.buildingID}
                />}
        </SafeAreaView>
    )
}

function sortAndCollateHours(hoursList) {
    let value = hoursList.sort(((e1, e2) => {
        let ord = e1.dayorder.localeCompare(e2.dayorder)
        if (ord == 0) return e1.Start.localeCompare(e2.Start);
        return ord;
    }))

    let hours = []
    let lastDayOrder = -1;
    let indCurrent = -1;
    for (let hour of value) {
        if (hour.dayorder == lastDayOrder) {
            hours[indCurrent][1].push(hour)
        } else {
            indCurrent += 1;
            lastDayOrder = hour.dayorder;
            hours.push([hour.day, [hour]]);
        }
    }
    return hours;
}

function joinBuildingInfo(hoursData, buildingData) {
    const temp = {};
    for (let [key, value] of Object.entries(hoursData)) {
        let hours = sortAndCollateHours(value);
        hours = hours.map((item) => {
            let string = makeHoursString(item);
            return [item[0], item[1], string];
        });
        temp[buildingData[key]["name"]] = 
            {
                ...buildingData[key],
                hours: hours,
                lastUpdated: value[0].lastUpdated,
            }
    }
    return Object.entries(temp);
}

function makeHoursString([key, hours]) {
    function joinParts(parts) {
        if (parts.length == 0) {
            return "";
        } else if (parts.length == 1) {
            return `${parts[0]}`;
        } else if (parts.length == 2) {
            return `${parts[0]} and ${joinParts(parts.slice(1))}`;
        } else {
            return `${parts[0]}, ${joinParts(parts.slice(1))}`;
        }
    }

    let string = [];
    for (rng of hours) {
        let temp = formatStartEnd(rng.Start, rng.End);
        if (temp == "Closed" && string.length == 0){
            string = [temp];
        } else {
            if (string.length > 0 && string[0] == "Closed") string[0] == temp;
            else if (temp != "Closed") string.push(temp);
        }
    }
    return `${joinParts(string)}`;
}

function formatStartEnd(start, end) {
    if (start == null && end == null) {
        return "Closed";
    } 
    if (start == "null") {
        return end;
    } else if (end == "null") {
        return start;
    }
    return `${start} to ${end}`;
}
