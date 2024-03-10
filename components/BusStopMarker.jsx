import React from 'react';
import { Callout, Marker } from 'react-native-maps';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';

export default function BusStopMarker(props) {
  const { title, color, coordinate } = props;
  return (
    <Marker
      coordinate={coordinate}
      flat
    >
      <View style={{
        borderColor: color, borderWidth: 5, backgroundColor: '#ffffff', height: 30, width: 30, borderRadius: 15, justifyContent: 'center', alignContent: 'center',
      }}
      />
      <Callout tooltip>
        <View>
          <View style={{
            borderColor: '#ffffff', borderWidth: 5, borderRadius: 5, backgroundColor: '#ffffff', flex: 1, width: '100%',
          }}
          >
            <Text style={{ flex: 1, padding: 10 }}>{title}</Text>
          </View>
          <View style={{
            borderRadius: 5, width: 10, height: 10, backgroundColor: '#ffffff', top: -5, left: 20, bottomPadding: -5,
          }}
          />
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
  color: PropTypes.string,
  title: PropTypes.string,
};
BusStopMarker.defaultProps = {
  color: '#000000',
  title: '',
};
