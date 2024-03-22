import React from 'react';
import PropTypes from 'prop-types';
import { Share, Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import ContextMenu from 'react-native-context-menu-view';
import { useCalendarPermissions } from 'expo-calendar';
import { Event, basicStringDate, requestAddEvent } from '../../utilities/DateTimeFunctions.ts';
import { HourRange } from '../../utilities/Scheduling.ts';

export default function DateButton({
  event: {
    date, timeRange, title, term,
  },
}) {
  const { fonts, colors, styling } = useTheme();
  const [status, requestPermissions] = useCalendarPermissions();
  const start = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    timeRange.start.getHours(),
    timeRange.start.getMinutes(),
    0,
  );
  const end = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    timeRange.end.getHours(),
    timeRange.end.getMinutes(),
    0,
  );
  const event = new Event(title, start, end, '', false, term);
  return (
    <ContextMenu
      actions={[
        { title: 'Save to Calendar' },
        { title: 'Share Event' },
      ]}
      onPress={({ nativeEvent: { name } }) => {
        switch (name) {
          case 'Save to Calendar':
            requestAddEvent(event, status, requestPermissions);
            break;
          case 'Share Event':
            Share.share({ message: `Furman University - ${term}: ${title}, ${basicStringDate(date)} ${timeRange.formatStartEnd()} ` });
            break;
          default:
            break;
        }
      }}
    >
      <View style={{
        ...styling.shadows, borderRadius: 5, backgroundColor: colors.card, margin: 5, padding: 5,
      }}
      >
        <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: colors.text }}>
          {title}
        </Text>
        <View style={{ flex: 2, flexDirection: 'row' }}>
          <View style={{ flexDirection: 'column' }}>
            <Text style={{ fontFamily: fonts.regular }}>
              {timeRange.formatStartEnd()}
            </Text>
            <Text style={{ flex: 1, fontFamily: fonts.italic }}>
              {`${term.trim()}`}
            </Text>
          </View>
          <Text style={{ flex: 1, fontFamily: fonts.regular, textAlign: 'right' }}>
            {`${basicStringDate(date)}`}
          </Text>
        </View>
      </View>
    </ContextMenu>
  );
}
DateButton.propTypes = {
  event: PropTypes.shape({
    timeRange: PropTypes.instanceOf(HourRange).isRequired,
    date: PropTypes.instanceOf(Date).isRequired,
    term: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};
