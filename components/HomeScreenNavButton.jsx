import React from 'react';
import {
  View, Text, Image,
} from 'react-native';
import PropTypes from 'prop-types';
import Page from '../utilities/Page';
import Button from './Button';

const renderFront = (sourceImage) => function curriedFront(style) {
  return <Icon sourceImage={sourceImage} style={style} />;
};

function Icon({ style, sourceImage }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Image style={style.icon} source={sourceImage} />
    </View>
  );
}
Icon.propTypes = {
  style: PropTypes.shape().isRequired,
  sourceImage: PropTypes.number.isRequired,
};

export default function HomeScreenNavButton({ styles, onPress, toPage }) {
  return (
    <Button
      accessibilityLabel={toPage.name}
      accessibilityHint={`Press to travel to the ${toPage.name} page.`}
      under={(
        <Text
          accessible
          accessibilityLabel={`${toPage.name}, title`}
          style={styles.label}
        >
          {toPage.name}
        </Text>
        )}
      front={renderFront(toPage.icon)}
      frontResponsive
      styles={styles.buttonStyles}
      onPress={onPress}
    />
  );
}
HomeScreenNavButton.propTypes = ({
  styles: PropTypes.shape({
    label: PropTypes.shape().isRequired,
    buttonStyles: PropTypes.oneOfType([
      PropTypes.shape().isRequired,
      PropTypes.func,
    ]),
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  toPage: PropTypes.instanceOf(Page).isRequired,
});
