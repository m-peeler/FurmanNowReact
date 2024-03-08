import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Alert, Pressable,
} from 'react-native';
import * as Calendar from 'expo-calendar';
import { useTheme } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { isAllDay, addToCalendar } from '../utilities/DateTimeFunctions';

function locIndText(locationIndicator) {
  switch (locationIndicator) {
    case 'H':
      return 'at Home against';
    case 'A':
      return 'at';
    default:
      return 'against';
  }
}

function formatVictoryMessage(item) {
  switch (item.resultStatus) {
    case 'L':
      return `Loss: ${item.resultUs} to ${item.resultThem}`;
    case 'W':
      return `Win: ${item.resultUs} to ${item.resultThem}`;
    default:
      return `${item.resultUs}-${item.resultThem}`;
  }
}

function formatOpponent(item) {
  switch (item.location_indicator) {
    case 'A':
      return `@ ${item.opponent}`;
    case 'H':
      return `vs. ${item.opponent}`;
    default:
      return `${item.opponent}`;
  }
}

function setupEventData(item) {
  const event = {
    title: `Furman ${item.sportTitle} ${locIndText(item.location_indicator)} ${item.opponent}`,
    startDate: item.eventdate,
    endDate: new Date(item.eventdate.getTime() + (2 * 60 * 60 * 1000)),
    location: item.location,
    allDay: item.allDay,
    timeZone: 'America/New_York',
    notes: `Go Furman ${item.sportTitle}! Roll Dins!`,
    availability: Calendar.Availability.BUSY,
  };
  return event;
}

function requestAddEvent(event, status, requestPermissions) {
  Alert.alert(
    'Add Event?',
    `Would you like to add ${event.title} to your calendar?`,
    [
      { text: 'Cancel', onPress: () => {} },
      { text: 'Ok', onPress: () => addToCalendar(event, status, requestPermissions), isPreferred: true },
    ],
  );
}

function buttonStyles(colors, fonts, home, pressed) {
  let textColor;
  if (pressed) {
    textColor = colors.notificationText;
  } else if (home) {
    textColor = colors.accentText;
  } else {
    textColor = colors.text;
  }
  return StyleSheet.create({
    backgroundColor:
            pressed
              ? colors.notification
              : colors.card,
    color: textColor,
    borderRadius: 10,
    margin: 2,
    padding: 6,
  });
}

function frontStyles(colors, fonts, home, pressed) {
  const sty = buttonStyles(colors, fonts, home, pressed);
  return StyleSheet.create({
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
      textAlign: 'right',
      alignSelf: 'flex-end',
    },
    info: {
      fontFamily: fonts.bold,
      fontSize: 16,
      color: sty.color,
      flex: 1,
      textAlign: 'right',
      marginRight: 10,
    },
    cancelled: {
      fontFamily: fonts.italic,
      fontSize: 16,
      marginLeft: 10,
      color: pressed ? colors.emergencyText : colors.negative,
    },
    victory: {
      fontFamily: fonts.italic,
      fontSize: 16,
      color: sty.color,
      alignContent: 'center',
      marginLeft: 10,
      flex: 1,
    },
  });
}

function formatDatetime(date) {
  if (date === undefined) {
    console.log('Hello', date);
    return '';
  }
  const month = date.toLocaleDateString('default', { month: 'short' });
  const weekday = date.toLocaleDateString('default', { weekday: 'short' });
  let time;
  if (isAllDay(date)) {
    time = 'All Day';
  } else {
    let hours = date.getHours() % 12;
    hours = hours === 0 ? 12 : hours;
    let minutes = date.getMinutes();
    minutes = minutes > 10 ? minutes : `0${minutes}`;
    const ampm = date.getHours() >= 12 && date.getHours() !== 24 ? 'pm' : 'am';
    time = `${hours}:${minutes} ${ampm}`;
  }
  return `${time}, ${weekday}. ${month}. ${date.getDate()}`;
}

function formatAccessibilitySummary(item) {
  const location = locIndText(item.location_indicator);
  if (item.resultStatus !== '') {
    let victStatus;
    if (item.resultStatus === 'W') {
      victStatus = 'won';
    } else if (item.resultStatus === 'L') {
      victStatus = 'lost';
    } else {
      victStatus = 'drew';
    }
    return `The ${item.sportTitle} team ${victStatus} ${location} ${item.opponent}, with a final score of Furman ${item.resultUs} to ${item.opponent} ${item.resultThem}`;
  } if (item.noplayText !== '') {
    return `The ${item.sportTitle} game ${location} ${item.opponent} was ${item.noplayText}.`;
  }
  return `The ${item.sportTitle} team will play ${location} ${item.opponent} ${formatDatetime(item.eventdate)}.`;
}

export default function AthleticsButton({ event }) {
  const { colors, fonts } = useTheme();
  const [pressed, setPressed] = useState(false);
  const [status, requestPermissions] = Calendar.useCalendarPermissions();
  const isHome = event.location_indicator === 'H';
  const styles = buttonStyles(colors, fonts, isHome, pressed);
  const internalStyles = frontStyles(colors, fonts, isHome, pressed);

  return (
    <Pressable
      frontResponsive
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onTouchCancel={() => setPressed(false)}
      onLongPress={() => requestAddEvent(
        setupEventData(event),
        status,
        requestPermissions,
      )}
      accessibilityLabel={formatAccessibilitySummary(event)}
      accessibilityHint="Click for more information."
      style={styles}
    >
      <View style={{ flexDirection: 'row' }}>
        <Text style={internalStyles.title}>{event.sportTitle}</Text>
        <Text style={internalStyles.versus}>
          {`${formatOpponent(event)}`}
        </Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        {event.noplayText !== ''
                && <Text style={internalStyles.cancelled}>{event.noplayText}</Text>}
        {event.resultStatus !== ''
                && <Text style={internalStyles.victory}>{formatVictoryMessage(event)}</Text>}
        <Text style={internalStyles.info}>{formatDatetime(event.eventdate)}</Text>
      </View>
    </Pressable>
  );
}
AthleticsButton.propTypes = {
  event: PropTypes.shape({
    location_indicator: PropTypes.string.isRequired,
    eventdate: PropTypes.instanceOf(Date).isRequired,
    noplayText: PropTypes.string.isRequired,
    resultStatus: PropTypes.string.isRequired,
    sportTitle: PropTypes.string.isRequired,
  }).isRequired,
};