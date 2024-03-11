/* eslint-disable global-require */
import React, { useEffect, useState } from 'react';
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

function TempDisplay({
  high, low, current, units,
}) {
  const { colors, fonts } = useTheme();
  const transparentColor = `${colors.card}D0`;

  return (
    <View style={{
      paddingLeft: '15%',
      backgroundColor: transparentColor,
      position: 'absolute',
      bottom: 40,
      flexDirection: 'column',
      borderTopRightRadius: 8,
      borderBottomRightRadius: 8,
    }}
    >
      <Text style={{
        color: colors.text,
        paddingTop: 5,
        fontFamily: fonts.bold,
        fontSize: 24,
        paddingLeft: 5,
      }}
      >
        {`${current}°${units}`}
      </Text>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{
          color: colors.text,
          fontFamily: fonts.italic,
          fontSize: 18,
          paddingBottom: 8,
        }}
        >
          {`${high}°${units} / `}
        </Text>
        <Text style={{
          color: colors.text,
          fontFamily: fonts.italic,
          fontSize: 15,
          alignSelf: 'flex-end',
          paddingBottom: 8,
        }}
        >
          {`${low}°${units}`}
        </Text>
      </View>
    </View>

  );
}
TempDisplay.propTypes = {
  high: PropTypes.string.isRequired,
  low: PropTypes.string.isRequired,
  current: PropTypes.string.isRequired,
  units: PropTypes.string,
};
TempDisplay.defaultProps = {
  units: 'F',
};

export default function Weather({ height, width }) {
  const [weather, , , , refresh] = useDataLoadFetchCache(
    'https://cs.furman.edu/~csdaemon/FUNow/weatherGet.php',
    'DATA:Weather-Retrieval',
    (data) => data.results[0],
    (data) => Date.now() - parseDatetime(data[0].start).getTime() < 1000 * 60 * 60,
  );
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      refresh();
      setReload(!reload);
    }, 30_000);
    return () => clearInterval(interval);
  }, [refresh, reload]);

  const { colors } = useTheme();
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
  return (
    <View
      accessible
      accessibilityLabel="Weather widget"
      accessibilityHint={weather && `It is currently ${weather.tempCurrent}°${weather.unit}; it'll be ${weather.shortForecast} with a high around ${weather.tempHi} and a low around ${weather.tempLo}. ${weather.precipitationPercent !== '' ? `There is a ${weather.precipitationPercent} chance of precipitation.` : ''}`}
    >
      <Image source={getCurrentImage()} style={weatherStyles} />
      {weather && (
      <TempDisplay
        accessible={false}
        accessibilityLabel=""
        high={weather.tempHi}
        low={weather.tempLo}
        current={weather.tempCurrent}
        units={weather.unit}
      />
      )}
    </View>
  );
}
Weather.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
