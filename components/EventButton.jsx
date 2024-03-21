import React, { useState } from 'react';
import { useTheme } from '@react-navigation/native';
import {
  Pressable, Share, Text, View,
} from 'react-native';
import PropTypes from 'prop-types';
import { useCalendarPermissions } from 'expo-calendar';
import ContextMenu from 'react-native-context-menu-view';
import { getDateSuffix, requestAddEvent, Event } from '../utilities/DateTimeFunctions.ts';
import { HourRange } from '../utilities/Scheduling.ts';

function formatDate(date) {
  if (date === undefined) {
    return '';
  }
  const month = date.toLocaleDateString('en-US', { timeZone: 'America/New_York', month: 'short' });
  const weekday = date.toLocaleDateString('en-US', { timeZone: 'America/New_York', weekday: 'long' });
  return `${weekday}, ${month}. ${date.getDate()}${getDateSuffix(date)}`;
}
function setupEventData({
  title, description, start, end, date, organizer, location,
}) {
  const event = new Event(
    title,
    new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      start.getHours(),
      start.getMinutes(),
      0,
    ),
    new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      end.getHours(),
      end.getMinutes(),
      0,
    ),
    location,
    `${description}\n Organized by ${organizer}.`,
  );
  return event;
}
export default function EventButton({
  title, description, start, end, date, organizer, location,
}) {
  const hourRange = new HourRange(start, end || new Date(start + 1000 * 60 * 60));
  const { colors, fonts } = useTheme();
  const [pressed, setPressed] = useState(false);
  const [engaged, setEngaged] = useState(false);
  const [status, requestPermissions] = useCalendarPermissions();
  const textColor = pressed ? colors.notificationText : colors.text;
  const backColor = pressed ? colors.notification : colors.card;
  return (
    <ContextMenu
      actions={[
        { title: 'Save to Calendar' },
        { title: 'Share Event' },
      ]}
      onPress={({ nativeEvent: { name } }) => {
        switch (name) {
          case 'Save to Calendar':
            requestAddEvent(
              setupEventData({
                title, description, start, end, date, organizer, location,
              }),
              status,
              requestPermissions,
            );
            break;
          case 'Share Event':
            Share.share({ message: `"${title}": ${location}, ${new HourRange(start, end).formatStartEnd()}` });
            break;
          default:
            break;
        }
      }}
    >
      <Pressable
        onTouchStart={() => setPressed(true)}
        onTouchEnd={() => setPressed(false)}
        onTouchCancel={() => setPressed(false)}
        onPress={() => setEngaged(!engaged)}
      >
        <View style={{
          backgroundColor: backColor,
          borderRadius: 8,
          marginVertical: 5,
          padding: 5,
          flexDirection: 'column',
        }}
        >
          <Text style={{
            fontSize: 24, fontFamily: fonts.bold, color: textColor, textAlign: 'center',
          }}
          >
            {`${title}`}
          </Text>
          <View style={{ flexDirection: 'row', alignContent: 'space-between' }}>
            <Text style={{
              color: textColor, fontFamily: fonts.regular, fontSize: 18, flex: 1,
            }}
            >
              {formatDate(date)}
            </Text>
            <Text style={{
              color: textColor, fontFamily: fonts.regular, fontSize: 18, flex: 1, textAlign: 'right',
            }}
            >
              {hourRange.formatStartEnd()}
            </Text>
          </View>
          <Text style={{
            textAlign: 'center', color: textColor, fontFamily: fonts.italic, fontSize: 12,
          }}
          >
            {`Located in ${location}`}
          </Text>
          <Text
            numberOfLines={engaged ? undefined : 2}
            ellipsizeMode="tail"
            style={{
              color: textColor,
              fontFamily: fonts.regular,
              fontSize: 14,
            }}
          >
            {`\t${description}`}
          </Text>
          {engaged && (
            <Text style={{
              textAlign: 'center', color: textColor, fontFamily: fonts.italic, fontSize: 16,
            }}
            >
              {`Organized by ${organizer}`}
            </Text>
          )}
        </View>
      </Pressable>
    </ContextMenu>
  );
}
EventButton.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  start: PropTypes.instanceOf(Date).isRequired,
  end: PropTypes.instanceOf(Date),
  date: PropTypes.instanceOf(Date).isRequired,
  organizer: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
};
EventButton.defaultProps = {
  end: undefined,
};
