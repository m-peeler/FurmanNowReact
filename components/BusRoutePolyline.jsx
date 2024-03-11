import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import ModifiedPolyline from './ModifiedPolyline';
import BusStopMarker from './BusStopMarker';

export default function BusRoutePolyline({ color, route, stops }) {
  return (
    <View>
      <ModifiedPolyline
        encodedCoordinates={route}
        strokeColor={color}
        strokeWidth={9}
        lineJoin="round"
      />
      {stops.map(({
        name, latitude, longitude, eta,
      }) => (
        <BusStopMarker
          key={name}
          title={name}
          color={color}
          eta={eta}
          coordinate={{ latitude, longitude }}
        />
      ))}
    </View>
  );
}
BusRoutePolyline.propTypes = {
  color: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired,
  stops: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    eta: PropTypes.number,
  })).isRequired,
};
