import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Pressable,
  Linking,
  Share,
} from 'react-native';
import * as Calendar from 'expo-calendar';
import { useTheme } from '@react-navigation/native';
import PropTypes from 'prop-types';
import ContextMenu from 'react-native-context-menu-view';
import { isAllDay, requestAddEvent, getDateSuffix } from '../utilities/DateTimeFunctions.ts';

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
    case 'N':
      return 'Unknown';
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
  const event = new Event(
    `Furman ${item.sportTitle} ${locIndText(item.location_indicator)} ${item.opponent}`,
    item.eventdate,
    new Date(item.eventdate.getTime() + (2 * 60 * 60 * 1000)),
    item.location,
    item.allDay,
    `Go Furman ${item.sportTitle}! Roll Dins!`,
    'America/New_York',
    Calendar.Availability.BUSY,
  );
  return event;
}

function buttonStyles(colors, fonts, home, pressed) {
  let textColor;
  if (pressed) {
    textColor = colors.notificationText;
  } else if (home) {
    textColor = colors.text;
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
      textAlign: 'left',
      alignSelf: 'flex-end',
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
      flex: 1,
    },
    home: {
      fontFamily: fonts.italic,
      fontSize: 16,
      color: pressed ? colors.notificationText : colors.notificationContrast,
      alignContent: 'center',
      flex: 1,
    },
    homeBox: {
      borderRadius: 30,
      backgroundColor: colors.notification,
      paddingHorizontal: 10,

    },
  });
}

function formatDatetime(date, verbose = false) {
  if (date === undefined) {
    return '';
  }
  const month = date.toLocaleDateString('en-US', { timeZone: 'America/New_York', month: verbose ? 'long' : 'short' });
  const weekday = date.toLocaleDateString('en-US', { timeZone: 'America/New_York', weekday: verbose ? 'long' : 'short' });
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
  const output = verbose
    ? `${time === 'All Day' ? 'all day ' : ''}on ${weekday}, ${month} ${date.getDate()}${getDateSuffix(date)}${time !== 'All Day' ? ` at ${time}` : ''}`
    : `${time}, ${weekday}. ${month}. ${date.getDate()}`;
  return output;
}

function formatSummary(item, verbose = false) {
  const location = locIndText(item.location_indicator);
  const team = `The ${verbose ? 'Furman ' : ''}${item.sportTitle} team`;
  if (item.resultStatus !== '') {
    let victStatus;
    if (item.resultStatus === 'W') {
      victStatus = 'won';
    } else if (item.resultStatus === 'L') {
      victStatus = 'lost';
    } else if (item.resultStatus === 'N') {
      victStatus = 'played';
    } else {
      victStatus = 'drew';
    }
    const results = `${team} ${victStatus} ${location} ${item.opponent}`;
    if (item.resultStatus === 'N') return `${results}.`;
    return `${results}, with a final score of Furman ${item.resultUs} to ${item.opponent} ${item.resultThem}`;
  } if (item.noplayText !== '') {
    return `${team} game ${location} ${item.opponent} was ${item.noplayText}.`;
  }
  return `${team} will play ${location} ${item.opponent} ${formatDatetime(item.eventdate, true)}.${verbose ? ' Roll Dins!' : ''}`;
}

export default function AthleticsButton({ event }) {
  const { colors, fonts } = useTheme();
  const [pressed, setPressed] = useState(false);
  const [status, requestPermissions] = Calendar.useCalendarPermissions();
  const isHome = event.location_indicator === 'H';
  const styles = buttonStyles(colors, fonts, isHome, pressed);
  const internalStyles = frontStyles(colors, fonts, isHome, pressed);

  let displayState = event.location_indicator === 'H' ? 'Home' : undefined;
  displayState = event.resultStatus !== '' ? 'Result' : displayState;
  displayState = event.noplayText !== '' ? 'Noplay' : displayState;

  let contextMenuMessage = 'Share the Game';
  contextMenuMessage = displayState === 'Result' ? 'Share the Recap' : contextMenuMessage;
  contextMenuMessage = displayState === 'Noplay' ? 'Share the Cancellation' : contextMenuMessage;
  return (
    <ContextMenu
      actions={[
        { title: 'Save to Calendar' },
        { title: contextMenuMessage },
      ]}
      onPress={({ nativeEvent }) => {
        const { name } = nativeEvent;
        switch (name) {
          case 'Save to Calendar':
            requestAddEvent(
              setupEventData(event),
              status,
              requestPermissions,
            );
            break;
          case 'Share the Game':
          case 'Share the Cancellation':
            Share.share({
              message: `${formatSummary(event, true)}\n\nShared from the Furman Now! app.`,
            });
            break;
          case 'Share the Recap':
            Share.share({
              message: `${formatSummary(event, true)}\n\nRead more at ${event.url}\n\nShared from the Furman Now! app.`,
            });
            break;
          default:
            break;
        }
      }}
    >
      <Pressable
        frontResponsive
        onTouchStart={() => setPressed(true)}
        onTouchEnd={() => setPressed(false)}
        onTouchCancel={() => setPressed(false)}
        onPress={() => {
          if (event.url && event.url !== '' && event.url !== 'null') {
            Linking.openURL(`https://furmanpaladins.com/${event.url}`);
          }
        }}
        accessibilityLabel={formatSummary(event)}
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
          {displayState === 'Noplay'
          && <Text style={internalStyles.cancelled}>{event.noplayText}</Text>}
          {displayState === 'Result'
          && <Text style={internalStyles.victory}>{formatVictoryMessage(event)}</Text>}
          {displayState === 'Home'
          && (
          <View style={internalStyles.homeBox}>
            <Text style={internalStyles.home}>Home Game!</Text>
          </View>
          )}
          <Text style={internalStyles.info}>{formatDatetime(event.eventdate)}</Text>
        </View>
      </Pressable>
    </ContextMenu>
  );
}
AthleticsButton.propTypes = {
  event: PropTypes.shape({
    location_indicator: PropTypes.string.isRequired,
    eventdate: PropTypes.instanceOf(Date).isRequired,
    noplayText: PropTypes.string.isRequired,
    resultStatus: PropTypes.string.isRequired,
    sportTitle: PropTypes.string.isRequired,
    url: PropTypes.string,
  }).isRequired,
};

function formatDate(date) {
  const month = date.toLocaleDateString('en-US', { timeZone: 'America/New_York', month: 'long' });
  const suffix = getDateSuffix(date);
  return `${month} ${date.getDate()}${suffix}, ${date.getFullYear()}`;
}

export function AthleticsHeading({ heading, date }) {
  const { colors, fonts } = useTheme();

  const style = {
    heading: {
      fontFamily: fonts.heading,
      fontSize: 28,
      color: colors.notificationContrast,
      flex: 1,
    },
    headingDate: {
      fontFamily: fonts.italic,
      fontSize: 18,
      color: colors.notificationContrast,
      textAlign: 'right',
    },
    bounding: {
      paddingTop: 4,
      paddingHorizontal: 10,
      alignContent: 'space-between',
      flexDirection: 'row',
      backgroundColor: colors.notification,
      borderRadius: 2,
    },
  };

  return (
    <View
      style={style.bounding}
      accessible
      accessibilityLabel={`${heading}, section heading`}
      accessibilityHint={
        `Beginning of section for ${heading !== 'Results' ? 'events happening' : ''} ${heading}`
      }
    >
      <Text style={style.heading}>{heading}</Text>
      {(date !== undefined)
        && (
        <View style={{ justifyContent: 'flex-end', flex: 1, marginBottom: 4 }}>
          <Text style={style.headingDate}>{formatDate(date)}</Text>
        </View>
        )}
    </View>
  );
}
AthleticsHeading.propTypes = {
  heading: PropTypes.string.isRequired,
  date: PropTypes.instanceOf(Date),
};
AthleticsHeading.defaultProps = {
  date: undefined,
};
