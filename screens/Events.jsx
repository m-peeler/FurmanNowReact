import React from 'react';
import { useTheme } from '@react-navigation/native';
import {
  SafeAreaView, Text, View,
} from 'react-native';
import PropTypes from 'prop-types';
import Carousel from 'react-native-reanimated-carousel';
import useDataLoadFetchCache from '../hooks/useDataLoadFetchCache';
import arrayPartition from '../utilities/ArrayFunctions';
import ButtonList from '../components/ButtonList';
import { getDateSuffix, parseDate, parseTime } from '../utilities/DateTimeFunctions';
import { HourRange } from '../utilities/Scheduling.ts';

function formatDate(date) {
  if (date === undefined) {
    return '';
  }
  const month = date.toLocaleDateString('en-US', { timeZone: 'America/New_York', month: 'short' });
  const weekday = date.toLocaleDateString('en-US', { timeZone: 'America/New_York', weekday: 'long' });
  return `${weekday}, ${month}. ${date.getDate()}${getDateSuffix(date)}`;
}

function EventButton({
  title, description, start, end, date, organizer, location,
}) {
  const hourRange = new HourRange(start, end || new Date(start + 1000 * 60 * 60));
  const { colors, fonts } = useTheme();
  return (
    <View style={{ marginVertical: 5, flexDirection: 'column' }}>
      <Text style={{
        fontSize: 24, fontFamily: fonts.bold, color: colors.text, textAlign: 'center',
      }}
      >
        {`${title}`}
      </Text>
      <View style={{ flexDirection: 'row', alignContent: 'space-between' }}>
        <Text style={{
          color: colors.text, fontFamily: fonts.italic, fontSize: 18, flex: 1,
        }}
        >
          {formatDate(date)}
        </Text>
        <Text style={{
          color: colors.text, fontFamily: fonts.italic, fontSize: 18, flex: 1, textAlign: 'right',
        }}
        >
          {hourRange.formatStartEnd()}
        </Text>
      </View>
      <Text style={{
        textAlign: 'center', color: colors.text, fontFamily: fonts.italic, fontSize: 12,
      }}
      >
        {`Located in ${location}`}
      </Text>
      <Text style={{ color: colors.text, fontFamily: fonts.regular, fontSize: 14 }}>{`\t${description}`}</Text>
      <Text style={{
        textAlign: 'center', color: colors.text, fontFamily: fonts.italic, fontSize: 16,
      }}
      >
        {`Organized by ${organizer}`}
      </Text>
    </View>
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
  const { colors, fonts } = useTheme();
  return (
    <View style={{
      borderRadius: 8,
      height: 700,
      width: 350,
      padding: 10,
      backgroundColor: colors.card,
    }}
    >
      <ButtonList
        estimatedItemSize={30}
        data={[name, ...events]}
        renderItem={({ item }) => {
          if (typeof item === 'string') {
            return (
              <Text style={{
                fontSize: 30, textAlign: 'center', color: colors.text, fontFamily: fonts.heading,
              }}
              >
                {item}
              </Text>
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
  const [data, loading, fetching] = useDataLoadFetchCache(
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

  return (
    <SafeAreaView style={{ margin: 8 }}>
      {(!loading || !fetching)
        && (
        <Carousel
          snapEnabled
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 1,
            parallaxAdjacentItemScale: 0.9,
            parallaxScrollingOffset: 100,
          }}
          data={data}
          renderItem={({ item }) => <EventsDisplay name={item[0]} events={item[1]} />}
          width={300}
          height={700}
          style={{ alignSelf: 'center', width: 380, height: 700 }}
        />
        )}
    </SafeAreaView>
  );
}
