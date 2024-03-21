import {
  Linking, Text, View, Dimensions,
} from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import ButtonList from '../components/ButtonList';
import useContacts from '../hooks/useContacts';
import { Contact, formatPhoneNumber, requestAddAlert } from '../utilities/ContactFunctions.ts';

// Sets the priorityLevel threshold at which a button will
// recieve the emergency coloration and be placed on the
// emergency list at the top.
const emergencyThreshold = 30;

const renderFront = (item) => function frontCurried(styles) {
  const {
    nameText, nameSize, numberText, numberSize, color,
  } = styles;
  return (
    <View style={{ paddingVertical: 3, paddingHorizontal: 10 }}>
      <Text style={
        {
          fontFamily: nameText,
          fontSize: nameSize,
          color,
        }
      }
      >
        {item.name}
      </Text>
      <View style={{
        alignContent: 'center',
        marginTop: 5,
        marginLeft: 10,
      }}
      >
        <Text style={
          {
            fontFamily: numberText,
            fontSize: numberSize,
            color,
          }
        }
        >
          {formatPhoneNumber(item.number)}
        </Text>
      </View>
    </View>
  );
};

const renderItem = (colors, fonts) => function renderCurried({ item }) {
  const emergency = item.priorityLevel >= emergencyThreshold;
  const unpressedText = emergency ? colors.emergencyText : colors.text;
  const unpressedButton = emergency ? colors.emergency : colors.card;

  const styles = (pressed) => ({
    front: {
      backgroundColor:
        pressed
          ? colors.notification
          : unpressedButton,
      color:
        pressed
          ? colors.notificationText
          : unpressedText,
      borderRadius: 5,
      margin: 2,
      numberText: fonts.regular,
      numberSize: 18,
      nameText: fonts.bold,
      nameSize: 24,
    },
    button: {
      backgroundColor:
        pressed
          ? colors.notification
          : unpressedButton,
      color:
        pressed
          ? colors.notificationText
          : unpressedText,
      borderRadius: 8,
    },
  });

  return (
    <Button
      onLongPress={(() => requestAddAlert(new Contact(item.name, item.number)))}
      delayLongPress={650}
      onPress={() => { Linking.openURL(`tel:${item.number}`); }}
      styles={styles}
      accessibilityLabel={item.name}
      accessibilityHint={`Press to call ${item.name} at ${item.number}, long press to save their contact.`}
      front={renderFront(item)}
      frontResponsive
    />
  );
};

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
              {renderItem(colors, fonts)({ item: data[0].value[0] })}
            </View>
            <ButtonList
              extraData={colors}
              estimatedItemSize={60}
              data={data[1].value}
              keyExtractor={(item) => item.id.toString()}
              style={normalStyle.bounding}
              renderItem={renderItem(colors, fonts)}
              sorter={(vals) => vals.sort((a, b) => a.name.localeCompare(b.name))
                .sort((a, b) => b.priorityLevel - a.priorityLevel)}
            />
          </SafeAreaView>
          )}
    </View>

  );
}
