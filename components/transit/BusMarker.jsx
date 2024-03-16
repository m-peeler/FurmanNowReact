/* eslint-disable react/jsx-no-comment-textnodes */
import React from 'react';
import { Image, View } from 'react-native';
import { Marker } from 'react-native-maps';
import PropTypes from 'prop-types';
import { useTheme } from '@react-navigation/native';
import BUS from '../../assets/icon/icon-bus.png';

export default function BusMarker({
  name, color, rotation, coordinate,
}) {
  const { colors } = useTheme();
  return (
    <Marker coordinate={coordinate} title={name} flat>
      <View
        style={{
          padding: 10,
          backgroundColor: colors.card,
          borderRadius: 20,
          transform: [{ rotate: `${rotation}deg` }],
        }}
      >
        <Image
          source={BUS}
          style={{
            height: 40,
            width: 40,
            tintColor: color,
          }}
        />
      </View>
    </Marker>
  );
}
BusMarker.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  rotation: PropTypes.number.isRequired,
  coordinate: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  }).isRequired,
};
