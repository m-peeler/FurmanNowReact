import React from 'react';
import { Callout, Marker } from 'react-native-maps';
import { Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import PropTypes from 'prop-types';

function colorByCat(category) {
  switch (category) {
    case 'misc':
    case 'misc.':
      return '#333333';
    case 'auxillary':
    case 'auxiliary':
      return '#75226c';
    case 'housing':
      return '#227c7c';
    case 'academic':
      return '#88224c';
    case 'athletic':
      return '#2c3f86';
    default:
      return '#000000';
  }
}

export default function BusStopMarker({
  coordinate, name, nickname, locationText, category, hasHours, buildingID,
}) {
  const { fonts } = useTheme();
  return (
    <Marker coordinate={coordinate} title={name} description={locationText !== undefined ? locationText : ''}>
      <View style={{ flexDirection: 'column' }}>
        <View
          style={{
            backgroundColor: colorByCat(category),
            borderRadius: 13,
            borderColor: 'white',
            borderWidth: 4,
            width: 26,
            height: 26,
          }}
        />
      </View>
      <Callout tooltip>
        <View>
          <View style={{
            backgroundColor: 'white',
            width: 300,
            flexDirection: 'row',
            borderRadius: 12,
            overflow: 'hidden',
          }}
          >
            <View style={{ paddingHorizontal: 10, paddingVertical: 5, flex: 1 }}>
              <Text style={{ color: 'black', fontSize: 20, flex: 1 }}>
                {nickname || name}
              </Text>
              {nickname
                && (<Text style={{ color: 'black', fontSize: 12, fontFamily: fonts.italic }}>{name}</Text>)}
              <Text style={{ color: 'black', fontSize: 15 }}>{locationText !== undefined ? locationText : ''}</Text>
            </View>
          </View>
        </View>
      </Callout>
    </Marker>
  );
}
BusStopMarker.propTypes = {
  coordinate: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  }).isRequired,
  name: PropTypes.string.isRequired,
  nickname: PropTypes.string,
  locationText: PropTypes.string,
  category: PropTypes.oneOf(['auxillary', 'auxiliary', 'housing', 'misc', 'misc.', 'academic', 'athletics']),
  hasHours: PropTypes.bool,
  buildingID: PropTypes.number,
};
BusStopMarker.defaultProps = {
  nickname: undefined,
  category: 'misc',
  locationText: undefined,
  hasHours: false,
  buildingID: undefined,
};
