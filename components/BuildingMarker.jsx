import React from 'react';
import { Polygon, Marker } from 'react-native-maps';
import { useTheme } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { decode } from '@googlemaps/polyline-codec';

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
    case 'dining':
      return '#332f1d';
    case 'athletics':
      return '#2c835c88';
    default:
      return '#000000';
  }
}

export default function BuildingMarker({
  coordinate, name, nickname, locationText, category, hasHours, buildingID, onPress, polyline,
}) {
  // eslint-disable-next-line no-param-reassign
  const { colors } = useTheme();
  return (
    polyline
      ? (
        <Polygon
          key={`${name} Shape`}
          accessible
          accessibilityLabel={`${name} location marker.`}
          coordinates={decode(polyline, 5).map(
            (point) => ({ latitude: point[0], longitude: point[1] }),
          )}
          onPress={onPress}
          lineCap="butt"
          fillColor={colorByCat(category)}
          strokeColor={colors.card}
          strokeWidth={4}
        />
      )
      : (
        <Marker
          accesssible
          accessibilityLabel={`${name} location marker.`}
          key={`${name} Marker`}
          coordinate={coordinate}
          onSelect={onPress}
          onPress={onPress}
        />
      )
  );
}
BuildingMarker.propTypes = {
  coordinate: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  }).isRequired,
  name: PropTypes.string.isRequired,
  nickname: PropTypes.string,
  locationText: PropTypes.string,
  category: PropTypes.oneOf(['auxillary', 'auxiliary', 'dining', 'housing', 'misc', 'misc.', 'academic', 'athletics']),
  hasHours: PropTypes.bool,
  buildingID: PropTypes.number,
  onPress: PropTypes.func,
  polyline: PropTypes.string,
};
BuildingMarker.defaultProps = {
  nickname: undefined,
  category: 'misc',
  locationText: undefined,
  hasHours: false,
  buildingID: undefined,
  onPress: undefined,
  polyline: PropTypes.string,
};
