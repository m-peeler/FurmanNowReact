import React from 'react';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import useAthleticsCalendar from '../hooks/useAthleticsCalendar';
import AthleticsButton, { AthleticsHeading } from '../components/AthleticsButton';

export default function Athletics() {
  const { colors } = useTheme();
  const [data] = useAthleticsCalendar();
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
