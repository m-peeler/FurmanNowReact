import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import ContextMenu from 'react-native-context-menu-view';
import { addToCalendar, basicStringDate } from '../../utilities/DateTimeFunctions';
import { HourRange } from '../../utilities/Scheduling';

export default function DateButton({ event }) {
  const { fonts, colors, styling } = useTheme();
  return (
    <ContextMenu
      actions={[
        { title: 'Save to Calendar' },
        { title: 'Share Event' },
      ]}
      onPress={({ nativeEvent: { name } }) => {
        switch (name) {
          case 'Save to Calendar':
            addToCalendar()
            break;
          case 'Share Event':
            break;
          default:
            break;
        }
      }}
    >
      <View style={{ ...styling.shadows, borderRadius: 5, margin: 5 }}>
        <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: colors }}>
          {event.title}
        </Text>
        <View style={{ flex: 2, flexDirection: 'row' }}>
          <View style={{ flexDirection: 'column' }}>
            <Text style={{ flex: 1, fontFamily: fonts.italic }}>
              {`${event.term.trim()}`}
            </Text>
            <Text style={{ fontFamily: fonts.regular }}>
              {`${basicStringDate(event.date)}`}
            </Text>
          </View>
          <Text style={{ flex: 1, fontFamily: fonts.regular, textAlign: 'right' }}>
            {event.timeRange.formatStartEnd()}
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
