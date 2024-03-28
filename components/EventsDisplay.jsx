import React from 'react';
import { useTheme } from '@react-navigation/native';
import { Dimensions, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { useHeaderHeight } from '@react-navigation/elements';
import ButtonList from './ButtonList';
import { parseDate, parseTime } from '../utilities/DateTimeFunctions.ts';
import EventButton from './EventButton';

export default function EventsDisplay({ name, events }) {
  const { colors, fonts, styling } = useTheme();
  const { height, width } = Dimensions.get('window');
  const header = useHeaderHeight();
  return (
    <View>
      <ButtonList
        estimatedItemSize={145}
        style={{
          borderRadius: 8,
          height: (height - header - 25),
          width: width * 0.925,
          backgroundColor: colors.card,
          marginHorizontal: width * 0.025,
          ...styling.shadows,
        }}
        data={[name, ...events]}
        renderItem={({ item }) => {
          if (typeof item === 'string') {
            return (
              <View style={{
                borderRadius: 8,
                padding: 5,
                backgroundColor: colors.notification,
              }}
              >
                <Text style={{
                  fontSize: 30,
                  paddingTop: 5,
                  textAlign: 'center',
                  textAlignVertical: 'bottom',
                  color: colors.notificationContrast,
                  fontFamily: fonts.heading,
                }}
                >
                  {item}
                </Text>
                {item === 'Other Events'
                  && (
                  <Text style={{
                    fontSize: 14,
                    fontFamily: fonts.regular,
                    color: colors.notificationContrast,
                    textAlign: 'center',
                  }}
                  >
                    {'Want your events to appear here? '
                    + 'Upload them to syncDIN with visibility set to "public"!'}
                  </Text>
                  )}
              </View>
            );
          }
          return (
            <EventButton
              title={item.title}
              description={item.description}
              date={parseDate(item.date)}
              start={parseTime(item.start)}
              end={parseTime(item.end)}
              organizer={item.organization}
              location={item.location}
            />
          );
        }}
      />
    </View>
  );
}
EventsDisplay.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape).isRequired,
  name: PropTypes.string.isRequired,
};
