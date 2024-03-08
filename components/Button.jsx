import React, { useState } from 'react';
import {
  View, Pressable,
} from 'react-native';
import PropTypes from 'prop-types';

export default function Button(props) {
  const {
    frontResponsive, behind, front, under, ...r
  } = props;
  const [pressed, setPressed] = useState(false);
  // eslint-disable-next-line prefer-const
  let { styles, ...rest } = r;
  if (typeof styles === 'function') {
    styles = styles(pressed);
  }
  const { cells: cellStyle, front: frontStyle, button: buttonStyle } = styles;
  return (
    <View style={[cellStyle,
      { flexDirection: 'column' }]}
    >
      <Pressable
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest}
        onTouchStart={() => setPressed(true)}
        onTouchEnd={() => setPressed(false)}
        onTouchCancel={() => setPressed(false)}
        style={buttonStyle}
      >
        <View style={{ flexDirection: 'column' }}>
          <View>
            {behind}
          </View>
          {frontResponsive
            ? front(frontStyle)
            : front}
        </View>
      </Pressable>
      {under}
    </View>
  );
}
Button.propTypes = {
  // If "frontResponsive" is true, styles should be a
  // function that takes in a boolean and yields
  // an object of this shape.
  styles: PropTypes.oneOfType([
    PropTypes.shape({
      button: PropTypes.shape,
      front: PropTypes.shape,
      cells: PropTypes.shape,
    }),
    PropTypes.func,
  ]),
  frontResponsive: PropTypes.bool,
  behind: PropTypes.node,
  front: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  under: PropTypes.node,
  delayLongPress: PropTypes.number,
};
Button.defaultProps = ({
  styles: {
    button: { backgroundColor: '#000000' },
    front: { alignItems: 'center' },
    behind: { alignItems: 'center' },
  },
  frontResponsive: false,
  delayLongPress: 500,
  behind: undefined,
  front: undefined,
  under: undefined,
});
