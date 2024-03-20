import * as Calendar from 'expo-calendar';
import { Alert, Linking, Platform } from 'react-native';

export function parseDate(date : string) : Date | undefined {
  if (date == null) return undefined;
  const [year, month, day] = date.split('-');
  return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
}

export function parseTime(time : string) : Date | undefined {
  if (time == null) return undefined;
  const [hour, minute, second] = time.split(':');
  return new Date(0, 0, 0, parseInt(hour, 10), parseInt(minute, 10), parseInt(second, 10));
}

export function parseDatetime(datetime : string) : Date | undefined {
  // Assumes a formatting of YYYY-MM-DD HH:mm:ss
  if (datetime == null) return undefined;
  const [date, time] = datetime.split(' ');
  const fdate = parseDate(date);
  const ftime = parseTime(time);
  if (fdate === undefined || ftime === undefined) return undefined;
  return new Date(
    fdate.getFullYear(),
    fdate.getMonth(),
    fdate.getDate(),
    ftime.getHours(),
    ftime.getMinutes(),
    ftime.getSeconds(),
  );
}

export function isAllDay(date : Date) : boolean{
  const rtrn = date.getHours() === 0
            && date.getMinutes() === 0
            && date.getSeconds() === 0;
  return rtrn;
}

export function getDateSuffix(date : Date) : string {
  const day = date.getDate();
  if (day > 3 && day < 21) { return 'th'; }
  if (day % 10 === 1) { return 'st'; }
  if (day % 10 === 2) { return 'nd'; }
  if (day % 10 === 3) { return 'rd'; }
  return 'th';
}

const directToSettings = () => {
  Alert.alert(
    'No Calendar Permissions',
    'You have denied permissions to modify your calendar. To add this event, grant calendar access in your settings.',
    [
      { text: 'Cancel', onPress: () => {} },
      { text: 'Give Access', onPress: () => Linking.openURL('app-settings:'), isPreferred: true },
    ],
  );
};

async function getDefaultCalendarSource() {
  const defaultCalendar = await Calendar.getDefaultCalendarAsync();
  return defaultCalendar.source;
}

class Cal implements Calendar.Calendar {
  title: string;
  sourceId?: string;
  source: Calendar.Source;
  color: string = '#583C83';
  entityType: string = Calendar.EntityTypes.EVENT;
  name: string = 'Furman Now! Events Calendar';
  ownerAccount: string = 'personal';
  accessLevel: string = Calendar.CalendarAccessLevel.OWNER;
  id: string = "Furman Now!";
  allowsModifications: boolean = true;
  allowedAvailabilities: string[] = Object.values(Calendar.Availability);

  constructor(title : string, source: Calendar.Source, sourceId?: string) {
    this.title = title;
    this.sourceId = sourceId;
    this.source = source;
  }
}

class Src implements Calendar.Source {
  name: string;
  id: string = '';
  type: string = Calendar.SourceType.LOCAL;
  isLocalAccount: boolean = true;
  constructor (name : string) {
    this.name = name;
  }  
}

const createFUNowCalendar = async (calendarTitle : string) => {
  const defaultCalendarSource = Platform.OS === 'ios'
    ? await getDefaultCalendarSource()
    : new Src(calendarTitle);
  let calendar = new Cal(calendarTitle, defaultCalendarSource, defaultCalendarSource.id)
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
          name: Platform.OS === 'ios' ? 'iCloud' : 'Default',
          type: Calendar.SourceType.CALDAV,
        },
      };
      const cal = await Calendar.createCalendarAsync(calendar);
      newCalendarID = cal;
    } catch (f) {
      const cal = await Calendar.getDefaultCalendarAsync();
      newCalendarID = cal.id;
    }
  }
  return newCalendarID;
};

const findCalenderByTitle = async (calendarTitle : string) => {
  try {
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    const matchedCals = calendars.filter((c) => c.title === calendarTitle);
    if (matchedCals.length > 0) return matchedCals[0].id;
    return await createFUNowCalendar(calendarTitle);
  } catch (e) {
    console.log(e);
    return '';
  }
};

type Status = {
  status: string;
  granted: boolean;
}

export async function addToCalendar(event : Event, status : Status, requestPermissions : () => Promise<Status>, calendarName : string = 'Furman Now!') {
  let stat = status;
  if (stat.status !== Calendar.PermissionStatus.GRANTED) {
    stat = await requestPermissions();
  }
  if (!stat.granted) {
    directToSettings();
    return;
  }
  const calendarID = await findCalenderByTitle(calendarName);

  try {
    await Calendar.createEventAsync(calendarID, event)
      .then(() => {
        Alert.alert(
          'Completed',
          `Successfully added ${event.title} to your calendar.`,
        );
        return calendarID;
      })
      .catch((e) => {
        console.log(e);
      });
  } catch (e) {
    console.log(e);
  }
}

export class Event {
  title: string;
  startDate: Date;
  endDate: Date;
  location: string;
  allDay: boolean;
  notes: string;
  timeZone: string;
  availability: string;

  constructor(title : string, startDate : Date, endDate : Date, location : string, allDay : boolean = false, notes : string = '', timeZone = 'America/New_York', availability = Calendar.Availability.BUSY) {
    this.title = title;
    this.startDate = startDate;
    this.endDate = endDate;
    this.location = location;
    this.allDay = allDay;
    this.notes = notes;
    this.timeZone = timeZone;
    this.availability = availability;
  }
}

export function requestAddEvent(event: Event, status : Status, requestPermissions : () => Promise<Status>) : void {
  Alert.alert(
    'Add Event?',
    `Would you like to add ${event.title} to your calendar?`,
    [
      { text: 'Cancel', onPress: () => {} },
      { text: 'Ok', onPress: () => addToCalendar(event, status, requestPermissions), isPreferred: true },
    ],
  );
}

export function basicStringDate(date : Date) : string {
  return `${date.toLocaleString('en-US', { weekday: 'short' })}. ${date.toLocaleString('en-US', { month: 'long', day: 'numeric' })}${getDateSuffix(date)}, ${date.getFullYear()}`;
}
