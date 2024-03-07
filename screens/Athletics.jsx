import React from 'react';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native';
import useDataLoadFetchCache from '../hooks/useDataLoadFetchCache';
import ButtonList from '../components/ButtonList';
import AthleticsButton from '../components/AthleticsButton';
import { isAllDay, parseDatetime } from '../utilities/DateTimeFunctions';

export default function Athletics() {
  const { colors, fonts } = useTheme();

  const [data, loading, fetching] = useDataLoadFetchCache(
    'https://cs.furman.edu/~csdaemon/FUNow/athleticsGet.php',
    'DATA:Athletics-Cache',
    (json) => {
      const results = json.results.map((item) => {
        const eventdate = parseDatetime(item.eventdate);
        const rtrn = { ...item, eventdate, allDay: isAllDay(eventdate) };
        return rtrn;
      });
      return results;
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
      {(!loading || !fetching)
        && (
        <ButtonList
          style={normalStyle}
          estimatedItemSize={73}
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={(item) => (
            <AthleticsButton
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...item}
            />
          )}
          sorter={(vals) => vals.sort(
            (a, b) => (a.eventdate > b.eventdate) - (a.eventdate < b.eventdate),
          )}
        />
        )}
    </SafeAreaView>
  );
}
