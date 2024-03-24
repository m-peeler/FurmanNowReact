export enum DaysOfWeek {
    MONDAY    = "Monday",
    TUESDAY   = "Tuesday",
    WEDNESDAY  = "Wednesday",
    THURSDAY   = "Thursday",
    FRIDAY    = "Friday",
    SATURDAY   = "Saturday",
    SUNDAY    = "Sunday"
 } 
 
 export class Schedule {
 
    static DAYORDER : DaysOfWeek[] = [DaysOfWeek.SUNDAY, DaysOfWeek.MONDAY, DaysOfWeek.TUESDAY, 
      DaysOfWeek.WEDNESDAY, DaysOfWeek.THURSDAY, DaysOfWeek.FRIDAY, DaysOfWeek.SATURDAY,]
 
    static dayToNum (day : DaysOfWeek) : number {
      return Schedule.DAYORDER.indexOf(day);
    }
 
    static getDOWFromString(day : string) : DaysOfWeek {
      for (const d of Schedule.DAYORDER) {
         if (d === day) return d;
      }
      throw "Invalid Day of Week name";
    }
 
    sched : {Monday : HourRange[],
             Tuesday : HourRange[],
             Wednesday : HourRange[],
             Thursday : HourRange[],
             Friday : HourRange[],
             Saturday : HourRange[],
             Sunday : HourRange[]
            };
 
    constructor() {
      let sched : any = {};
      for (const day of Schedule.DAYORDER) {
         sched[day] = [];
      }
      this.sched = sched;
    }
 
    addHourRangeToDay(day : DaysOfWeek, hourRange : HourRange) {
      for (const cur of this.sched[day]) {
         if (cur.isInRange(hourRange.end) || cur.isInRange(hourRange.start)) {
            cur.mergeRange(hourRange);
            return
         }
      }
      this.sched[day].push(hourRange);
      this.sched[day].sort((a,b) => timeCompare(a.start, b.start));
    }
 
    makeHoursString(day : DaysOfWeek) : string {
      let hours = this.sched[day]
      function joinParts(parts : string[]) : string {
         if (parts.length == 1) {
            return `${parts[0]}`;
         } else {
            return `${parts[0]}\n${joinParts(parts.slice(1))}`;
         }
      }
    
      let string : string[] = [];
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
      if (dayOfWeek === null) return false;
      const dayBeforeIndex = (Schedule.DAYORDER.indexOf(dayOfWeek) + 6) % 7;
      const dayBefore = Schedule.DAYORDER[dayBeforeIndex];
    
      for (const hourRange of this.sched[dayOfWeek]) {
         if (hourRange.rangeIsOrdered()) {
            if (hourRange.isInRange(time)) {
              return true;
            }
         } else {
            if (timeCompare(hourRange.start, time) <= 0) {
              return true;
            }
         }
      }
 
      // Checks day before to see if there were any times that spilled over into today
      for (const hourRange of this.sched[dayBefore]) {
         if ( !hourRange.rangeIsOrdered() 
              && timeCompare(time, hourRange.end) <= 0) {
            return true;
         }
      }
 
      return false;
    }

    isClosingWithin(time : Date, minsWithin : number) : boolean {
      const dayOfWeek = Schedule.getDOWFromDate(time);
      if (dayOfWeek === null) return false;
      const dayBeforeIndex = (Schedule.DAYORDER.indexOf(dayOfWeek) + 6) % 7;
      const dayBefore = Schedule.DAYORDER[dayBeforeIndex];

      for (const hourRange of this.sched[dayOfWeek]) {
         if (hourRange.rangeIsOrdered()) {
            if (hourRange.isInRange(time) && timesWithinMinutes(time, hourRange.end, minsWithin) ) {
              return true;
            }
         } else {
            if (timeCompare(hourRange.start, time) <= 0 && timesWithinMinutes(time, hourRange.end, minsWithin)) {
              return true;
            }
         }
      }

      // Checks day before to see if there were any times that spilled over into today
      for (const hourRange of this.sched[dayBefore]) {
         if ( !hourRange.rangeIsOrdered() 
               && timeCompare(time, hourRange.end) <= 0
               && timesWithinMinutes(time, hourRange.end, minsWithin)) {
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

/*
 * Checks if first is before second, and by no more than min minutes. 
 * Date independed, i.e. 11:30 pm would be within 90 minutes of 1:00 am  
 */
function timesWithinMinutes(first : Date, second : Date, mins : number) : boolean {
   const sub = timeSubtractionMinutes(second, first);
   return sub >= 0 && sub < mins;
}

/*
 * Returns first minus second in minutes. If first is before second, 
 * assumes second is on the previous day; i.e. 1:00 am - 11:30 pm
 * is 90 minutes.
 */
function timeSubtractionMinutes(first : Date, second : Date) : number {
   if (timeCompare(first, second) > 0) {
      const hours = first.getHours() - second.getHours();
      const minutes = first.getMinutes() - second.getMinutes();
      const seconds = first.getSeconds() - second.getSeconds();
      return (60 * hours) + minutes + (seconds / 60); 
   } else {
     const hours = first.getHours() + 24 - second.getHours();
     const minutes = first.getMinutes() - second.getMinutes();
     const seconds = first.getSeconds() - second.getSeconds();
     return (60 * hours) + minutes + (seconds / 60);
   }}
 
 export class HourRange {
    start : Date
    end : Date
    constructor(start : Date, end : Date) {
      this.start = start;
      this.end = end;
    }
 
    rangeIsOrdered() {
      return timeCompare(this.start, this.end) <= 0;
    }
 
    isInRange(time : Date) {
      if (this.start == null && this.end == null) return false;
      return (timeCompare(this.start, time) <= 0 && 
         timeCompare(time, this.end) <= 0);
    }
 
    mergeRange(that : HourRange) {
      this.start = timeCompare(this.start, that.start) <= 0 ? this.start : that.start;
      this.end = timeCompare(this.end, that.end) >= 0 ? this.end : that.end
    }
    
    formatStartEnd() {
      if (this.start == null && this.end == null) {
         return "Closed";
      } 
      if (this.start == null) {
         return `${HourRange.formatTimeNums(this.end)} ${HourRange.hoursToAm(this.end)}`;
      } else if (this.end == null) {
         return `${HourRange.formatTimeNums(this.start)} ${HourRange.hoursToAm(this.start)}`;
      } else if (timeCompare(this.start, this.end) == 0) {
         return `${HourRange.formatTimeNums(this.start)} ${HourRange.hoursToAm(this.start)}`;
      }
      return `${HourRange._formatHourRange(this)}`;
    }
 
    static _formatHourRange = (hourRange : HourRange) : string => {
 
      let startam : string, endam : string;
      
      startam =  HourRange.hoursToAm(hourRange.start);
      endam =   HourRange.hoursToAm(hourRange.end);
    
      let stStr = HourRange.formatTimeNums(hourRange.start);
      let edStr = HourRange.formatTimeNums(hourRange.end);

      if (hourRange.start == hourRange.end) return `${stStr} ${startam}`; 
      return `${stStr} ${startam} to ${edStr} ${endam}`
    }
 
    static hoursToAm = (hours : Date) : string => {
      return hours.getHours() - 12 >= 0 && hours.getHours() != 24 ? "pm" : "am";
    }
 
    static hoursToStr = (hours : number) : string => {
      return `${hours % 12 == 0 ? 12 : hours % 12}`;
    }
    static formatTimeNums = (date : Date) : string => {
      return `${HourRange.hoursToStr(date.getHours())}:${date.getMinutes() < 10 ? "0" : "" }${date.getMinutes()}`
    }
 }
 
export function datetimeCompare (first : Date, second : Date) {
    const dateComp = dateCompare(first, second);
    if (dateComp != 0) return dateComp;
    return timeCompare(first, second);
}

export const timeCompare = (timeA : Date, timeB : Date) : number => {
  if (timeA == null && timeB == null) return 0;
  if (timeA == null) return -1;
  if (timeB == null) return 1;
  let hoursComp = timeA.getHours() - timeB.getHours();
  if (hoursComp != 0) return hoursComp > 0 ? 1 : -1;
  let minutesComp = timeA.getMinutes() - timeB.getMinutes();
  if (minutesComp != 0) return minutesComp > 0 ? 1 : -1;
  let secondsComp = timeA.getSeconds() - timeB.getSeconds();
  if (secondsComp != 0) return secondsComp > 0 ? 1 : -1;
  return 0;
}

 export function dateCompare(first : Date, second : Date) : number {
    if (first == null && second == null) return 0;
    if (first == null) return -1;
    if (second == null) return 1;
    const yearDiff = first.getFullYear() - second.getFullYear();
    if (yearDiff !== 0) {
      return yearDiff > 0 ? 1 : -1;
    }
    const monthDiff = first.getMonth() - second.getMonth();
    if (monthDiff !== 0) {
      return monthDiff > 0 ? 1 : -1;
    }
    const dayDiff = first.getDate() - second.getDate();
    if (dayDiff === 0) return 0;
    return dayDiff > 0 ? 1 : -1;
  }