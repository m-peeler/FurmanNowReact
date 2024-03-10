import React from 'react';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import useDataLoadFetchCache from '../hooks/useDataLoadFetchCache';
import AthleticsButton, { AthleticsHeading } from '../components/AthleticsButton';
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
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const partitioned = arrayPartition(parsed, (item) => {
        const comparedToToday = dateCompare(item.eventdate, today);
        if (comparedToToday < 0 || item.resultStatus !== '') return 'Results';
        if (comparedToToday === 0) return 'Today';
        const comparedToTomorrow = dateCompare(item.eventdate, tomorrow);
        if (comparedToTomorrow === 0) return 'Tomorrow';
        return 'This Week';
      });
      const compForSort = (a, b) => (a.eventdate > b.eventdate) - (a.eventdate < b.eventdate);
      let output = [];
      // If there are elements in it, adds each sorted
      // list (prefixed by its header) to the output list
      output = [
        ...(partitioned.Results !== undefined
          ? [{ heading: 'RESULTS' },
            ...partitioned.Results.sort(compForSort)]
          : []),
        ...(partitioned.Today !== undefined
          ? [{ heading: 'TODAY', date: today },
            ...partitioned.Today.sort(compForSort)]
          : []),
        ...(partitioned.Tomorrow !== undefined
          ? [{ heading: 'TOMORROW', date: tomorrow },
            ...partitioned.Tomorrow.sort(compForSort)]
          : []),
        ...(partitioned['This Week'] !== undefined
          ? [{ heading: 'THIS WEEK' },
            ...partitioned['This Week'].sort(compForSort)]
          : [])];
      return output;
    },
  );

  const style = {
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
  };

  return (
    <SafeAreaView>
      {(data !== undefined)
        && (
        <View style={style.bounding}>
          <FlashList
            estimatedItemSize={73}
            data={data}
            renderItem={({ item }) => {
              if ('heading' in item) {
                return (
                  <AthleticsHeading
                    heading={item.heading}
                    date={item.date}
                  />
                );
              }
              return (
                <AthleticsButton
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
