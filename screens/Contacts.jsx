import {
  Text, View, Dimensions,
} from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import ButtonList from '../components/ButtonList';
import useContacts from '../hooks/useContacts';
import ContactContentButton from '../components/ContactContentButton';

// Sets the priorityLevel threshold at which a button will
// recieve the emergency coloration and be placed on the
// emergency list at the top.
const emergencyThreshold = 30;

export default function Contacts() {
  const { colors, fonts } = useTheme();
  const headerHeight = useHeaderHeight();

  const normalStyle = {
    bounding: {
      borderRadius: 10,
      backgroundColor: colors.card,
      marginHorizontal: 20,
      marginVertical: 5,
      marginBottom: 10,
      padding: 5,
      alignSelf: 'center',
      position: 'absolute',
      top: 85,
      width: '95%',
      height: Dimensions.get('window').height - 85 - 30 - headerHeight,
      flexGrow: 10,
    },
    loadingText: {
      fontFamily: fonts.bold,
      fontSize: 20,
      color: colors.text,
    },
    scrollEnabled: true,
  };

  const emergencyStyle = {
    ...normalStyle,
    bounding: {
      ...normalStyle.bounding,
      marginBottom: 5,
      marginTop: 10,
      top: 0,
      height: 'auto',
      width: '95%',
      flex: 1,
      flexGrow: 1,
      position: 'absolute',
    },
    scrollEnabled: false,
  };

  const [data, fetching, loading] = useContacts();
  return (
    <View style={{ flex: 1, paddingBottom: 38 + 60 }}>
      {(fetching && loading)
        && (
        <View style={normalStyle.bounding}>
          <Text style={normalStyle.loadingText}>Loading...</Text>
        </View>
        )}
      {data && data[0] !== undefined && (!fetching || !loading)
      && (
      <SafeAreaView>
        <View style={emergencyStyle.bounding}>
          <ContactContentButton
            name={data[0].value[0].name}
            content={data[0].value[0].number}
            priority
            type="phone"
          />
        </View>
        <ButtonList
          extraData={colors}
          estimatedItemSize={60}
          data={data[1].value}
          keyExtractor={(item) => item.id.toString()}
          style={normalStyle.bounding}
          renderItem={({ item: { name, number, priorityLevel } }) => (
            <ContactContentButton
              name={name}
              content={number}
              priority={priorityLevel > emergencyThreshold}
              type="phone"
            />
          )}
          sorter={(vals) => vals.sort((a, b) => a.name.localeCompare(b.name))
            .sort((a, b) => b.priorityLevel - a.priorityLevel)}
        />
      </SafeAreaView>
      )}
    </View>
  );
}
