import useDataLoadFetchCache from "./useDataLoadFetchCache";
import { useEffect, useState } from "react";
import { parseTime } from "../utilities/DateTimeFunctions";

export default function useBuildingHours() {
    const [hoursData, hoursLoad, hoursFetch] = 
        useDataLoadFetchCache(
            "https://cs.furman.edu/~csdaemon/FUNow/hoursGet.php",
            "DATA:Building-Hours-Cache",
            async (d) => {
                let json = await d.json();
                let hours = {};
                for (const item of json.results) {
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
                for (const item of json.results) {
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

    return data;

}

enum DaysOfWeek {
    MONDAY      = "Monday",
    TUESDAY     = "Tuesday",
    WEDNESDAY   = "Wednesday",
    THURSDAY    = "Thursday",
    FRIDAY      = "Friday",
    SATURDAY    = "Saturday",
    SUNDAY      = "Sunday"
} 

class Schedule {

    static DAYORDER = [DaysOfWeek.MONDAY, DaysOfWeek.TUESDAY, DaysOfWeek.WEDNESDAY, 
                        DaysOfWeek.THURSDAY, DaysOfWeek.FRIDAY, DaysOfWeek.SATURDAY,
                        DaysOfWeek.SUNDAY]

    static dayToNum (day : DaysOfWeek) {
        return Schedule.DAYORDER.indexOf(day);
    }

    static getDOWFromString(day : string) : DaysOfWeek {
        for (const d of Schedule.DAYORDER) {
            if (d === day) return d;
        }
        return
    }

    sched : {DaysOfWeek? : HourRange[]}

    constructor() {
        this.sched = {};
        for (const day of Schedule.DAYORDER) {
            this.sched[day] = []
        }
    }

    addHourRangeToDay(day : DaysOfWeek, hourRange : HourRange) {
        this.sched[day].push(hourRange);
    }

    makeHoursString(day : DaysOfWeek) : string {
        let hours = this.sched[day]
        function joinParts(parts : string[]) {
            if (parts.length == 0) {
                return "";
            } else if (parts.length == 1) {
                return `${parts[0]}`;
            } else if (parts.length == 2) {
                return `${parts[0]} and \n${joinParts(parts.slice(1))}`;
            } else {
                return `${parts[0]}, \n${joinParts(parts.slice(1))}`;
            }
        }
    
        let string = [];
        for (const range of hours) {
            let temp = range.formatStartEnd();
            if (temp == "Closed" && string.length == 0){
                string = [temp];
            } else {
                if (string.length > 0 && string[0] == "Closed") string[0] == temp;
                else if (temp != "Closed") string.push(temp);
            }
        }
        return `${joinParts(string)}`;
    }

    static getDOWFromDate(date : Date) : DaysOfWeek {
        return Schedule.getDOWFromString(
            date.toLocaleString("en-US", 
                {timeZone: "America/New_York", 
                weekday: "long"})
            );

    }

    isOpened(time : Date) : boolean {
        const dayOfWeek = Schedule.getDOWFromDate(time);
        const dayBeforeIndex = (Schedule.DAYORDER.indexOf(dayOfWeek) + 6) % 7;
        const dayBefore = Schedule.DAYORDER[dayBeforeIndex];
    
        for (const hourRange of this.sched[dayOfWeek]) {
            if (hourRange.rangeIsOrdered()) {
                if (hourRange.isInRange(time)) {
                    return true;
                }
            } else {
                if (compareTimes(hourRange.start, time) <= 0) {
                    return true;
                }
            }
        }

        // Checks day before to see if there were any times that spilled over into today
        for (const hourRange of this.sched[dayBefore]) {
            if ( !hourRange.rangeIsOrdered() 
                    && compareTimes(time, hourRange.end) <= 0) {
                return true;
            }
        }

        return false;
    }

    dailySchedules(onlyToday = false) {
        let scheds = []
        if (onlyToday) {
            let today = Schedule.getDOWFromDate(new Date(Date.now()));
            return [[today, this.makeHoursString(today)]];
        }
        for (const day of Schedule.DAYORDER) {
            scheds.push([day, this.makeHoursString(day)]);
        }
        return scheds;
    } 

}

class HourRange {
    start : Date
    end : Date
    constructor(start : Date, end : Date) {
        this.start = start;
        this.end = end;
    }

    rangeIsOrdered() {
        return compareTimes(this.start, this.end) <= 0;
    }

    isInRange(time : Date) {
        if (this.start == null && this.end == null) return false;
        return (compareTimes(this.start, time) <= 0 && 
            compareTimes(time, this.end) <= 0);
    }
    
    formatStartEnd() {
        if (this.start == null && this.end == null) {
            return "Closed";
        } 
        if (this.start == null) {
            return `${HourRange.formatTimeNums(this.end)} ${HourRange.hoursToAm(this.end)}`;
        } else if (this.end == null) {
            return `${HourRange.formatTimeNums(this.start)} ${HourRange.hoursToAm(this.start)}`;
        }
        return `${HourRange._formatHourRange(this)}`;
    }

    static _formatHourRange = (hourRange : HourRange) : string => {

        let startam : String, endam : String;
        
        startam =   HourRange.hoursToAm(hourRange.start);
        endam =     HourRange.hoursToAm(hourRange.end);
    
        let stStr = HourRange.formatTimeNums(hourRange.start);
        let edStr = HourRange.formatTimeNums(hourRange.end);

        return `${stStr} ${startam} to ${edStr} ${endam}`
    }

    static hoursToAm = (hours : Date) : string => {
        return hours.getHours() - 12 > 0 && hours.getHours() != 24 ? "pm" : "am";
    }

    static hoursToStr = (hours : number) : string => {
        return `${hours % 12 == 0 ? 12 : hours % 12}`;
    }
    static formatTimeNums = (date : Date) : string => {
        return `${HourRange.hoursToStr(date.getHours())}:${date.getMinutes() < 10 ? "0" : "" }${date.getMinutes()}`
    }
}

const compareTimes = (timeA : Date, timeB : Date) : number => {
    if (timeA == null && timeB == null) return 0;
    if (timeA == null) return 1;
    if (timeB == null) return -1;
    let hoursComp = timeA.getHours() - timeB.getHours();
    if (hoursComp != 0) return hoursComp > 0 ? 1 : -1;
    let minutesComp = timeA.getMinutes() - timeB.getMinutes();
    if (minutesComp != 0) return minutesComp > 0 ? 1 : -1;
    let secondsComp  = timeA.getSeconds() - timeB.getSeconds();
    if (secondsComp != 0) return secondsComp > 0 ? 1 : -1;
    return 0;
}


function sortAndCollateHours(hoursList : [{day: string, dayorder : number , Start : string, End: string}]) : Schedule {
    let value = hoursList.sort(((e1, e2) => {
        let ord = Number(e1.dayorder > e2.dayorder) - Number(e2.dayorder > e1.dayorder);
        if (ord == 0) return e1.Start.localeCompare(e2.Start);
        return ord;
    }))
    let sched : Schedule = new Schedule();
    for (let hour of value) {
        let range = new HourRange(parseTime(hour.Start), parseTime(hour.End));
        sched.addHourRangeToDay(Schedule.getDOWFromString(hour.day), range);
    }
    return sched;
}

function joinBuildingInfo(hoursData, buildingData) {
    const temp = {};

    for (let key in hoursData) {
        let sched = sortAndCollateHours(hoursData[key]);
        temp[buildingData[key]["name"]] = 
            {
                ...buildingData[key],
                schedule: sched,
                lastUpdated: hoursData[key][0].lastUpdated,
            }
    }
    return Object.entries(temp);
}



