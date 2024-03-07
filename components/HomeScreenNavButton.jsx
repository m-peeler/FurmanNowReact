import React from 'react';
import {
  View, Text, Image,
} from 'react-native';
import PropTypes from 'prop-types';
import Page from '../utilities/Page';
import Button from './Button';

function Icon({ icon }) {
  return (
    <View style={{ alignItems: 'center', justifyItems: 'center' }}>
      <Image style={{ resizeMode: 'contain' }} source={icon} />
    </View>
  );
}
Icon.propTypes = {
  icon: PropTypes.string.isRequired,
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
          zIndex={1}
        >
          {toPage.name.toUpperCase()}
        </Text>
        )}
      front={(
        <Icon icon={toPage.icon} />
      )}
      styles={styles.buttonStyles}
      onPress={onPress}
    />
  );
}
HomeScreenNavButton.propTypes = ({
  styles: PropTypes.shape({
    label: PropTypes.shape.isRequired,
    buttonStyles: PropTypes.shape.isRequired,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  toPage: PropTypes.instanceOf(Page).isRequired,
});
