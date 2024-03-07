import React from 'react';
import { SectionList } from 'react-native';

export default function ButtonList(props) {
  const {
    data, renderItem, renderSectionHeader, keyExtractor, style,
  } = props;
  let { sortSections, sortWithSections } = props;
  if (sortSections == undefined) {
    sortSections = ((data) => data);
  }
  if (sortWithSections == undefined) {
    sortWithSections = ((data) => data);
  }
  return (
    <View style={style.bounding}>
      <SectionList
        data={sortSections(data).map((item) => sortWithinSections(item))}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        renderSectionHeader={renderSectionHeader}
        scrollEnabled={style.scrollEnabled}
      />
    </View>
  );
}
