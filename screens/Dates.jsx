import React from 'react';
import { useTheme } from '@react-navigation/native';
import {
  Dimensions, SafeAreaView, Text, View,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useHeaderHeight } from '@react-navigation/elements';
import ButtonList from '../components/ButtonList';
import DateButton from '../components/dates/DateButton';
import useImportantDates from '../hooks/useImportantDates';

export default function Dates() {
  const { colors, fonts, styling } = useTheme();
  const [data] = useImportantDates();
  const header = useHeaderHeight();
  const styles = {
    back: {
      borderRadius: 8,
      marginTop: 10,
      marginHorizontal: 20,
      height: Dimensions.get('window').height - header - 30,
      width: Dimensions.get('window').width - 40,
      backgroundColor: colors.card,
      ...styling.shadows,
    },
    titleBounding: {
      marginHorizontal: 10,
      marginTop: 10,
      backgroundColor: colors.notification,
      borderRadius: 8,
    },
    title: {
      padding: 5,
      color: colors.notificationContrast,
      fontFamily: fonts.heading,
      textAlign: 'center',
      fontSize: 24,
    },
    listBounding: {
      borderRadius: 5,
      height: Dimensions.get('window').height - header - 90,
      width: Dimensions.get('window').width - 40,
    },
  };
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
            <View style={styles.back}>
              <View style={styles.titleBounding}>
                <Text style={styles.title}>
                  {category}
                </Text>
              </View>
              <ButtonList
                data={entries}
                style={styles.listBounding}
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
