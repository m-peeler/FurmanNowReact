import React from 'react';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView, Text, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import useDataLoadFetchCache from '../hooks/useDataLoadFetchCache';
import AthleticsButton from '../components/AthleticsButton';
import { isAllDay, parseDatetime } from '../utilities/DateTimeFunctions';
import arrayPartition from '../utilities/ArrayFunctions';
import { dateCompare } from '../utilities/Scheduling.ts';

export default function Athletics() {
  const { colors, fonts } = useTheme();

  const [data] = useDataLoadFetchCache(
    'https://cs.furman.edu/~csdaemon/FUNow/athleticsGet.php',
    'DATA:Athletics-Cache',
    (json) => {
      const parsed = json.results.map((item) => {
        const eventdate = parseDatetime(item.eventdate);
        const rtrn = { ...item, eventdate, allDay: isAllDay(eventdate) };
        return rtrn;
      });
      const today = new Date(Date.now());
      const tomorrow = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
      const partitioned = arrayPartition(parsed, (item) => {
        const comparedToToday = dateCompare(item.eventdate, today);
        if (comparedToToday < 0) return 'Results';
        if (comparedToToday === 0) return 'Today';
        const comparedToTomorrow = dateCompare(item.eventdate, tomorrow);
        if (comparedToTomorrow === 0) return 'Tomorrow';
        return 'This Week';
      });
      const compForSort = (a, b) => (a.eventdate > b.eventdate) - (a.eventdate < b.eventdate);
      let output = [];
      output = ['Results',
        ...(partitioned.Results !== undefined
          ? partitioned.Results.sort(compForSort) : [])];
      output = [...output,
        'Today',
        ...(partitioned.Today !== undefined
          ? partitioned.Today.sort(compForSort) : [])];
      output = [...output,
        'Tomorrow',
        ...(partitioned.Tomorrow !== undefined
          ? partitioned.Tomorrow.sort(compForSort) : [])];
      output = [...output,
        'This Week',
        ...(partitioned['This Week'] !== undefined
          ? partitioned['This Week'].sort(compForSort) : [])];
      console.log('Output', output);
      return output;
    },
  );

  const normalStyle = {
    bounding: {
      alignSelf: 'center',
      height: '97%',
      width: '95%',
      borderRadius: 10,
      backgroundColor: colors.card,
      marginVertical: '2.5%',
      padding: 5,
    },
    loadingText: {
      fontFamily: fonts.bold,
      fontSize: 20,
      color: colors.text,
    },
    scrollEnabled: true,
  };

  return (
    <SafeAreaView>
      {(data !== undefined)
        && (
        <View style={normalStyle.bounding}>
          <FlashList
            estimatedItemSize={73}
            data={data}
            renderItem={({ item }) => {
              if (typeof item === 'string') {
                return <Text>{item}</Text>;
              }
              return (
                <AthleticsButton
                // eslint-disable-next-line react/jsx-props-no-spreading
                  event={item}
                />
              );
            }}
          />
        </View>
        )}
    </SafeAreaView>
  );
}
