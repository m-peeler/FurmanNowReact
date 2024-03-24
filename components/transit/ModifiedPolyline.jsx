import { decode } from '@googlemaps/polyline-codec';
import { Polyline } from 'react-native-maps';
import PropTypes from 'prop-types';
import React from 'react';

export default function ModifiedPolyline(props) {
  const { encodedCoordinates, strokeWidth } = props;
  const coordinates = decode(encodedCoordinates, 5).map(
    (point) => ({ latitude: point[0], longitude: point[1] }),
  );

  return (
    <>
      <Polyline
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        strokeWidth={strokeWidth + 5}
        strokeColor="#ffffff"
        coordinates={coordinates}
      />
      <Polyline
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        coordinates={coordinates}
      />
    </>
  );
}

ModifiedPolyline.propTypes = {
  encodedCoordinates: PropTypes.string.isRequired,
  strokeWidth: PropTypes.number.isRequired,
  strokeColor: PropTypes.string,
};

ModifiedPolyline.defaultProps = {
  strokeColor: '#000000',
};
