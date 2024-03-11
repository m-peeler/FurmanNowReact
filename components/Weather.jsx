/* eslint-disable global-require */
import React from 'react';
import { View, Text, Image } from 'react-native';
import PropTypes from 'prop-types';
import { useTheme } from '@react-navigation/native';
import useDataLoadFetchCache from '../hooks/useDataLoadFetchCache';
import { parseDatetime } from '../utilities/DateTimeFunctions';

function getCurrentImage() {
  const rightNow = new Date(Date.now());
  switch (rightNow.getMonth()) {
    case 0:
      switch (rightNow.getMinutes() % 3) {
        case 0:
          return require('../assets/images/months/January.jpeg');
        case 1:
          return require('../assets/images/months/January-1.jpeg');
        case 2:
        default:
          return require('../assets/images/months/January-2.webp');
      }
    case 1:
      return require('../assets/images/months/February.jpg');
    case 2:
      return require('../assets/images/months/March-0.jpeg');
    case 3:
    default:
      return require('../assets/images/months/April.jpeg');
  }
}

export default function Weather({ height, width }) {
  const [weather,,, refresh] = useDataLoadFetchCache(
    'https://cs.furman.edu/~csdaemon/FUNow/weatherGet.php',
    'DATA:Weather-Retrieval',
    (data) => data.results[0],
    (data) => Date.now() - parseDatetime(data[0].start).getTime() < 1000 * 60 * 60,
  );
  const { colors, fonts } = useTheme();
  const weatherStyles = {
    flexDirection: 'row',
    backgroundColor: colors.card,
    alignSelf: 'flex-start',
    alignContent: 'center',
    justifyContent: 'center',
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    top: -10,
    width,
    height,
  };
  const transparentColor = `${colors.card}D0`;
  return (
    <View
      accessible
      accessibilityLabel="Weather widgit"
      accessibilityHint=""
    >
      <Image source={getCurrentImage()} style={weatherStyles} />
      <View style={{
        paddingLeft: '15%',
        backgroundColor: transparentColor,
        position: 'absolute',
        bottom: 40,
        flexDirection: 'column',
      }}
      >
        <Text style={{
          color: colors.text,
          paddingTop: 5,
          fontFamily: fonts.bold,
          fontSize: 24,
          paddingLeft: 30,
        }}
        >
          {weather && `${weather.tempCurrent}°F`}
        </Text>
        <Text style={{
          color: colors.text,
          fontFamily: fonts.italic,
          fontSize: 18,
          paddingBottom: 8,
        }}>
          {weather && `${weather.tempHi}°F / ${weather.tempLo}°F`}
        </Text>
      </View>
    </View>
  );
}
Weather.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
