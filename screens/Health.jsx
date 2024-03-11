import React from 'react';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import useDataLoadFetchCache from '../hooks/useDataLoadFetchCache';

export default function Health() {
  const { colors, fonts } = useTheme();
  const [data, loading, fetching] = useDataLoadFetchCache(
    'https://cs.furman.edu/~csdaemon/FUNow/healthSafetyGet.php',
    'DATA:Health-Safety-Cache',
    (dt) => dt.results,
  );

  const style = StyleSheet.create({
    fontFamily: fonts.bold,
    color: colors.text,
  });

  return (
    <SafeAreaView>
      {(!loading || !fetching)
        && <Text style={style}>{data.map((item) => `${item.name} \t ${item.content}\n`)}</Text>}
    </SafeAreaView>
  );
}
