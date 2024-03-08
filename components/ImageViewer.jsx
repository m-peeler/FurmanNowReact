import React from 'react';
import { StyleSheet, Image } from 'react-native';
import PropTypes from 'prop-types';

const defaultStyles = StyleSheet.create({
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
});

export default function ImageViewer({ imageSource, styles }) {
  const styl = styles === undefined ? defaultStyles : styles;
  return (
    <Image imageSource={imageSource} style={styl.image} />
  );
}
ImageViewer.propTypes = {
  imageSource: PropTypes.string.isRequired,
  styles: PropTypes.shape({
    image: PropTypes.shape,
  }),
};
ImageViewer.defaultProps = {
  styles: defaultStyles,
};
