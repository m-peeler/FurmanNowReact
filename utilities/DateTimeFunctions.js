import * as Calendar from 'expo-calendar';
import { Alert, Linking, Platform } from 'react-native';

export function parseDate(date) {
  if (date == null) return null;
  const [year, month, day] = date.split('-');
  return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
}

export function parseTime(time) {
  if (time == null) return null;
  const [hour, minute, second] = time.split(':');
  return new Date(0, 0, 0, parseInt(hour, 10), parseInt(minute, 10), parseInt(second, 10));
}

export function parseDatetime(datetime) {
  // Assumes a formatting of YYYY-MM-DD HH:mm:ss
  if (datetime == null) return null;
  const [date, time] = datetime.split(' ');
  const fdate = parseDate(date);
  const ftime = parseTime(time);
  return new Date(
    fdate.getFullYear(),
    fdate.getMonth(),
    fdate.getDate(),
    ftime.getHours(),
    ftime.getMinutes(),
    ftime.getSeconds(),
  );
}

export function isAllDay(date) {
  const rtrn = date.getHours() === 0
            && date.getMinutes() === 0
            && date.getSeconds() === 0;
  return rtrn;
}

export function getDateSuffix(date) {
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

const createFUNowCalendar = async (calendarTitle) => {
  const defaultCalendarSource = Platform.OS === 'ios'
    ? await getDefaultCalendarSource()
    : { isLocalAccount: true, name: 'Furman Now!' };
  let calendar = {
    title: calendarTitle,
    color: '#583C83',
    entityType: Calendar.EntityTypes.EVENT,
    sourceId: defaultCalendarSource.id,
    source: defaultCalendarSource,
    name: 'Furman Now! Events Calendar',
    ownerAccount: 'personal',
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
  };

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
      newCalendarID = cal.id;
    } catch (f) {
      const cal = await Calendar.getDefaultCalendarAsync();
      newCalendarID = cal.id;
    }
  }
  return newCalendarID;
};

const findCalenderByTitle = async (calendarTitle) => {
  try {
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    const matchedCals = calendars.filter((c) => c.title === calendarTitle);
    if (matchedCals.length > 0) return matchedCals[0].id;
    return await createFUNowCalendar(calendarTitle);
  } catch (e) {
    console.log(e);
    return null;
  }
};

export async function addToCalendar(event, status, requestPermissions, calendarName = 'Furman Now!') {
  let stat = status;
  if (stat.status !== Calendar.PermissionStatus.GRANTED) {
    stat = await requestPermissions();
  }
  if (!status.granted) {
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

export function requestAddEvent(event, status, requestPermissions) {
  Alert.alert(
    'Add Event?',
    `Would you like to add ${event.title} to your calendar?`,
    [
      { text: 'Cancel', onPress: () => {} },
      { text: 'Ok', onPress: () => addToCalendar(event, status, requestPermissions), isPreferred: true },
    ],
  );
}
