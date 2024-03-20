import React, { useEffect, useState } from 'react';
import { useTheme } from '@react-navigation/native';
import {
  Dimensions,
  Pressable,
  SafeAreaView, Text, View,
} from 'react-native';
import PropTypes from 'prop-types';
import { useHeaderHeight } from '@react-navigation/elements';
import Carousel from 'react-native-reanimated-carousel';
import { Availability, useCalendarPermissions } from 'expo-calendar';
import useDataLoadFetchCache from '../hooks/useDataLoadFetchCache';
import arrayPartition from '../utilities/ArrayFunctions';
import ButtonList from '../components/ButtonList';
import {
  getDateSuffix, parseDate, parseTime, requestAddEvent,
} from '../utilities/DateTimeFunctions';
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
  const event = {
    title,
    startDate: new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      start.getHours(),
      start.getMinutes(),
      0,
    ),
    endDate: new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      end.getHours(),
      end.getMinutes(),
      0,
    ),
    location,
    timeZone: 'America/New_York',
    notes: `${description}\n Organized by ${organizer}.`,
    availability: Availability.BUSY,
  };
  return event;
}

function EventButton({
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
    <Pressable
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onTouchCancel={() => setPressed(false)}
      onLongPress={() => requestAddEvent(
        setupEventData({
          title, description, start, end, date, organizer, location,
        }),
        status,
        requestPermissions,
      )}
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
        { engaged && (
          <Text style={{
            textAlign: 'center', color: textColor, fontFamily: fonts.italic, fontSize: 16,
          }}
          >
            {`Organized by ${organizer}`}
          </Text>
        )}
      </View>
    </Pressable>
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

function EventsDisplay({ name, events }) {
  const { colors, fonts, styling } = useTheme();
  const { height, width } = Dimensions.get('window');
  const header = useHeaderHeight();
  return (
    <View>
      <ButtonList
        style={{
          borderRadius: 8,
          height: (height - header - 25),
          width: width * 0.925,
          backgroundColor: colors.card,
          marginHorizontal: width * 0.025,
          ...styling.shadows,
        }}
        estimatedItemSize={30}
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
                  color: colors.black,
                  fontFamily: fonts.heading,
                }}
                >
                  {item}
                </Text>
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

export default function Events() {
  const [data] = useDataLoadFetchCache(
    'https://cs.furman.edu/~csdaemon/FUNow/clpGet.php',
    'DATA:Events-Cache',
    (dt) => Object.entries(arrayPartition(dt.results, ({ eventType }) => {
      switch (eventType) {
        case 'CLP':
          return 'CLPs';
        case 'syncDIN':
          return 'Other Events';
        default:
          return 'Other Events';
      }
    })).sort((a, b) => {
      // Puts the CLPs page first.
      if (a[0] === 'CLPs' && b[0] === 'CLPs') return 0;
      if (a[0] === 'CLPs') return -1;
      if (b[0] === 'CLPs') return 1;
      return a[0].localeCompare(b[0]);
    }),
  );
  const [delayed, setDelayed] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setDelayed(true);
    }, 450);
    return () => clearInterval(interval);
  }, []);
  const { height, width } = Dimensions.get('window');
  return (
    <SafeAreaView style={{ margin: 8 }}>
      {(data)
        && (
        <Carousel
          loop={false}
          snapEnabled
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 1,
            parallaxAdjacentItemScale: 0.9,
            parallaxScrollingOffset: 100,
          }}
          data={delayed ? data : [data[0]]}
          renderItem={({ item }) => <EventsDisplay name={item[0]} events={item[1]} />}
          width={width}
          height={height}
          style={{ alignSelf: 'center', width, height }}
          panGestureHandlerProps={{ activeOffsetX: [-10, 10] }}
        />
        )}
    </SafeAreaView>
  );
}
