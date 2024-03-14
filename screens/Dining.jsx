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
  const { colors, fonts } = useTheme();
  return (
    <View style={{
      borderRadius: 8, padding: 10, margin: 10, backgroundColor: colors.card, flexDirection: 'column',
    }}
    >
      <Text style={{
        textAlign: 'center', fontSize: 24, fontFamily: fonts.heading, color: colors.text,
      }}
      >
        {meal}
      </Text>
      {stationMenus.map(
        ([station, entries]) => (
          <View>
            <Text style={{ fontSize: 16, fontFamily: fonts.regular, color: colors.text }}>
              {`${station}`}
            </Text>
            { entries.map(({ itemName }) => (
              <Text style={{
                paddingLeft: 10, fontSize: 16, fontFamily: fonts.regular, color: colors.text,
              }}
              >
                {itemName}
              </Text>
            ))}
          </View>
        ),
      )}
    </View>
  );
}
DHMenuCard.propTypes = {
  meal: PropTypes.string.isRequired,
  stationMenus: PropTypes.arrayOf().isRequired,
};
