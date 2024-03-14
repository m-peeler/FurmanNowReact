import React from 'react';
import { Dimensions, FlatList, View } from 'react-native';
import PropTypes from 'prop-types';

export default function ButtonList(props) {
  const {
    data, sorter, style, ...rest
  } = props;
  return (
    <View style={{ ...style }}>
      <View style={{
        flexGrow: 1, flex: 1, borderRadius: 4, margin: '2.5%', height: '97.5%', width: '95%',
      }}
      >
        <FlatList
          style={{ height: Dimensions.get('window').height }}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...rest}
          contentContainerStyle={{ flexGrow: 1 }}
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
