import React from 'react';
import { View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import PropTypes from 'prop-types';

export default function ButtonList(props) {
  const {
    data, sorter, style, ...rest
  } = props;
  return (
    <View style={style}>
      <View style={{
        borderRadius: 4, margin: '2.5%', height: '97.5%', width: '95%',
      }}
      >
        <FlashList
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...rest}
          data={sorter(data)}
        />
      </View>
    </View>
  );
}
ButtonList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape).isRequired,
  sorter: PropTypes.func,
  style: PropTypes.shape({
    borderRadius: PropTypes.number.isRequired,
    height: PropTypes.oneOfType([
      PropTypes.number.isRequired,
      PropTypes.string.isRequired,
    ]).isRequired,
    width: PropTypes.oneOfType([
      PropTypes.number.isRequired,
      PropTypes.string.isRequired,
    ]).isRequired,
  }).isRequired,
};
ButtonList.defaultProps = {
  sorter: (a) => a,
};
