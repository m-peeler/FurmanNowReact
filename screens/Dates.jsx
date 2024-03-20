import React from 'react';
import { useTheme } from '@react-navigation/native';
import {
  Dimensions, SafeAreaView, Text, View,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useHeaderHeight } from '@react-navigation/elements';
import useDataLoadFetchCache from '../hooks/useDataLoadFetchCache';
import arrayPartition from '../utilities/ArrayFunctions';
import ButtonList from '../components/ButtonList';
import { parseDate, parseTime } from '../utilities/DateTimeFunctions';
import { HourRange, dateCompare } from '../utilities/Scheduling.ts';
import DateButton from '../components/dates/DateButton';

export default function Dates() {
  const { colors, fonts, styling } = useTheme();
  const [data] = useDataLoadFetchCache(
    'https://cs.furman.edu/~csdaemon/FUNow/importantDateGet.php',
    'DATA:Dates-Cache',
    (resp) => {
      if (resp.results === undefined) return undefined;
      const parsed = resp.results.map(({
        date, startTime, endTime, ...rest
      }) => (
        {
          ...rest,
          date: parseDate(date),
          timeRange: new HourRange(parseTime(startTime), parseTime(endTime)),
        }
      ));
      return Object.entries(
        arrayPartition(parsed, 'category'),
      ).sort(([k1], [k2]) => k1.localeCompare(k2))
        .map(([key, value]) => [
          key,
          value.sort(({ date: d1 }, { date: d2 }) => dateCompare(d1, d2)),
        ]);
    },
  );

  const header = useHeaderHeight();
  return (
    <SafeAreaView>
      {(data)
        && (
        <Carousel
          data={data}
          style={{ alignSelf: 'center' }}
          height={Dimensions.get('window').height}
          width={Dimensions.get('window').width}
          loop={false}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 1,
            parallaxAdjacentItemScale: 0.9,
            parallaxScrollingOffset: 100,
          }}
          renderItem={({ item: [category, entries] }) => (
            <View style={{
              borderRadius: 8,
              marginTop: 10,
              marginHorizontal: 20,
              height: Dimensions.get('window').height - header - 30,
              width: Dimensions.get('window').width - 40,
              backgroundColor: colors.card,
              ...styling.shadows,
            }}
            >
              <View style={{ margin: 10, backgroundColor: colors.notification, borderRadius: 8 }}>
                <Text style={{
                  padding: 5,
                  color: colors.notificationContrast,
                  fontFamily: fonts.heading,
                  fontSize: 20,
                }}
                >
                  {category}
                </Text>
              </View>
              <ButtonList
                data={entries}
                style={{ borderRadius: 5, height: Dimensions.get('window').height - header - 90, width: Dimensions.get('window').width - 40 }}
                renderItem={({ item }) => (
                  <DateButton event={item} />
                )}
              />
            </View>
          )}
        />
        )}
    </SafeAreaView>
  );
}
