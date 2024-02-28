import * as Calendar from "expo-calendar";
import { Alert, Linking, Platform } from "react-native";

const furmanNowCalName = "Furman Now!"

export function parseDatetime(datetime) {
    // Assumes a formatting of YYYY-MM-DD HH:mm:ss
    const [date, time] = datetime.split(" ");
    const fdate = parseDate(date);
    const ftime = parseTime(time);
    return new Date(fdate.getFullYear(), fdate.getMonth(), fdate.getDate(),
         ftime.getHours(), ftime.getMinutes(), ftime.getSeconds());
}

export function parseDate(date) {
    const [year, month, day] = date.split("-");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day) );
}

export function parseTime(time) {
    const [hour, minute, second] = time.split(":");
    return new Date(0, 0, 0, parseInt(hour), parseInt(minute), parseInt(second));
}

export function isAllDay(date) {
    
    
    let rtrn = date.getHours() == 0 && date.getMinutes() == 0 && date.getSeconds() == 0;
    
    return rtrn;
}

const directToSettings = () => {
    Alert.alert(
        "No Calendar Permissions",
        "You have denied permissions to modify your calendar. To add this event, grant calendar access in your settings.",
        [
            {text: "Cancel", onPress: () => {}},
            {text: "Give Access", onPress: () => Linking.openURL("app-settings:"), isPreferred: true}
        ]
    );
}

const findCalenderByTitle = async (calendarTitle) => {
    try {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        for (c of calendars) 
            if (c.title === calendarTitle) 
                return c.id;
        return await createFUNowCalendar(calendarTitle);
    } catch (e) {
        console.log(e);
    }
}

async function getDefaultCalendarSource() {
    const defaultCalendar = await Calendar.getDefaultCalendarAsync();
    return defaultCalendar.source;
  }

const createFUNowCalendar = async (calendarTitle) => {
    const defaultCalendarSource = Platform.OS == "ios" 
                                ? await getDefaultCalendarSource() 
                                : { isLocalAccount: true, name: "Furman Now!"};
    let calendar = 
    {
        title: calendarTitle,
        color: "#583C83",
        entityType: Calendar.EntityTypes.EVENT,
        sourceId: defaultCalendarSource.id,
        source: defaultCalendarSource,
        name: "Furman Now! Events Calendar",
        ownerAccount: "personal",
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
    }
    
    
    let newCalendarID;
    try {
        const cal = await Calendar.createCalendarAsync(calendar); 
        newCalendarID = cal;
    } catch (e) {
        try { 
            calendar = {
                ...calendar,
                sourceId: undefined,
                source: {
                    name: Platform.OS === "ios" ? "iCloud" : "Default", 
                    type: Calendar.SourceType.CALDAV,
                }
            }
            const cal = await Calendar.createCalendarAsync(calendar);
            newCalendarID = cal.id;
        } catch (e) {
            const cal = await Calendar.getDefaultCalendarAsync();
            newCalendarID = cal.id;
        }    
    }
    return newCalendarID;
}

export async function addToCalendar(event, status, requestPermissions, calendarName = "Furman Now!") {
    if (status.status != Calendar.PermissionStatus.GRANTED) {
        status = await requestPermissions();
    }
    if (!status.granted) {
        directToSettings();
        return;
    }
    let calendarID = await findCalenderByTitle(calendarName);
    
    try {
        await Calendar.createEventAsync(calendarID, event)
            .then(() => {
                Alert.alert(
                    "Completed",
                    `Successfully added ${event.title} to your calendar.`)
                return calendarID;
                })
            .catch((e) => {
                console.log(e); 
                return;
            });
    } catch (e) {
        console.log(e);
        return;
    }
}
