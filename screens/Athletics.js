import { useTheme } from "@react-navigation/native"
import {SafeAreaView, StyleSheet, Text, View} from "react-native"
import useDataLoadFetchCache from "../hooks/useDataLoadFetchCache";
import ButtonList from "../components/ButtonList";
import AthleticsButton from "../components/AthleticsButton";
import {isAllDay, parseDatetime} from "../utilities/DateTimeFunctions";

export default function Athletics({navigation, pages}) {
    const {colors, fonts} = useTheme();
    
    const [data, loading, fetching] = 
        useDataLoadFetchCache(
            "https://cs.furman.edu/~csdaemon/FUNow/athleticsGet.php",
            "DATA:Athletics-Cache",
            async (data) => {
                let results = await data.json();
                results = results.results.map((item) => {
                                let eventdate = parseDatetime(item.eventdate);
                                let rtrn = {...item, eventdate: eventdate, allDay: isAllDay(eventdate)};
                                return rtrn;
                            })
                return results;
            }
        )

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

    return (
        <SafeAreaView>
            {(!loading || !fetching) && 
                <ButtonList
                    style={normalStyle}
                    estimatedItemSize={73}
                    data={data}
                    keyExtractor = {(item) => item["id"].toString()}
                    renderItem={(props) => 
                        (<AthleticsButton 
                                        {...props} 
                                        colors={colors} 
                                        fonts={fonts}/>)
                    }
                    sorter= {(vals) =>{
                        return vals.sort((a,b) => (a.eventdate > b.eventdate) - (a.eventdate < b.eventdate))
                        }}

                />}
        </SafeAreaView>
    )
}