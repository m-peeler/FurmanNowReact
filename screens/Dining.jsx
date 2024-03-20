import React from 'react';
import { useTheme } from '@react-navigation/native';
import {
  Dimensions,
  View,
  SafeAreaView,
  Text,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import PropTypes from 'prop-types';
import { FlashList } from '@shopify/flash-list';
import { useHeaderHeight } from '@react-navigation/elements';
import useDataLoadFetchCache from '../hooks/useDataLoadFetchCache';
import arrayPartition from '../utilities/ArrayFunctions';

export default function Dining() {
  const [data] = useDataLoadFetchCache(
    'https://cs.furman.edu/~csdaemon/FUNow/dhMenuGet.php',
    'DATA:DH-Dining-Cache',
    (foods) => Object.entries(arrayPartition(foods.results, 'meal'))
      .map(([meal, items]) => [meal, Object.entries(arrayPartition(items, 'station'))]),
  );

  return (
    <SafeAreaView>
      <Carousel
        loop={false}
        panGestureHandlerProps={{ activeOffsetX: [-10, 10] }}
        snapEnabled
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 1,
          parallaxAdjacentItemScale: 0.9,
          parallaxScrollingOffset: 100,
        }}
        data={data}
        renderItem={({ item }) => (
          <DHMenuCard meal={item[0]} stationMenus={item[1]} />
        )}
        width={Dimensions.get('window').width}
        height={Dimensions.get('window').height}
      />
    </SafeAreaView>
  );
}

function DHMenuCard({ meal, stationMenus }) {
  const { colors, fonts, styling } = useTheme();
  const header = useHeaderHeight();
  console.log(header);
  const styles = {
    card: {
      borderRadius: 8,
      padding: 10,
      margin: 10,
      backgroundColor: colors.card,
      flexDirection: 'column',
      height: Dimensions.get('window').height - header - 20,
      ...styling.shadows,
    },
    heading: {
      textAlign: 'center',
      fontSize: 24,
      fontFamily: fonts.heading,
      color: colors.text,
    },
    station: {
      fontSize: 24,
      fontFamily: fonts.bold,
      color: colors.notificationContrast,
    },
    stationBox: {
      borderRadius: 10,
      backgroundColor: colors.notification,
      padding: 5,
      margin: 5,
    },
    foodItem: {
      padding: 5,
      fontSize: 16,
      fontFamily: fonts.regular,
      color: colors.text,
    },
  };
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>
        {meal}
      </Text>
      <FlashList
        data={stationMenus}
        renderItem={({ item: [station, entries] }) => (
          <View>
            <View style={styles.stationBox}>
              <Text style={styles.station}>
                {`${station}`}
              </Text>
            </View>
            { entries.map(({ itemName }) => (
              <Text style={styles.foodItem}>
                {itemName}
              </Text>
            ))}
          </View>
        )}
      />
    </View>
  );
}
DHMenuCard.propTypes = {
  meal: PropTypes.string.isRequired,
  stationMenus: PropTypes.arrayOf().isRequired,
};
