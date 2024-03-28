import React from 'react';
import { useTheme } from '@react-navigation/native';
import { Dimensions, SafeAreaView, StyleSheet } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import useDataLoadFetchCache from '../hooks/useDataLoadFetchCache';
import ButtonList from '../components/ButtonList';
import ContactContentButton from '../components/ContactContentButton';

export default function Safety() {
  const { colors, fonts } = useTheme();
  const [data] = useDataLoadFetchCache(
    'https://cs.furman.edu/~csdaemon/FUNow/healthSafetyGet.php',
    'DATA:Health-Safety-Cache',
    (dt) => dt.results.filter((item) => item.type === 'link' || item.type === 'phone' || item.type === 'email'),
  );

  const header = useHeaderHeight();

  const style = StyleSheet.create({
    fontFamily: fonts.bold,
    backgroundColor: colors.card,
    borderRadius: 8,
    margin: 10,
    height: Dimensions.get('window').height - header - 20,
    width: Dimensions.get('window').width - 20,
  });
  return (
    (data)
      && (
      <SafeAreaView>
        <ButtonList
          data={data}
          style={style}
          renderItem={
            ({ item: { name, content, type } }) => (
              <ContactContentButton key={name} name={name} content={content} type={type} />
            )
          }
        />
      </SafeAreaView>
      )
  );
}
