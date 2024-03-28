import {
  Linking, Text, View, Share,
} from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import ContextMenu from 'react-native-context-menu-view';
import PropTypes from 'prop-types';
import Button from './Button';
import { Contact, formatPhoneNumber, requestAddAlert } from '../utilities/ContactFunctions.ts';

function formatContent(content, type) {
  switch (type) {
    case 'phone':
      return formatPhoneNumber(content);
    case 'email':
    case 'link':
    default:
      return content;
  }
}

const renderFront = ({ content, name }) => function frontCurried(styles) {
  const {
    nameText, nameSize, contentText, contentSize, color,
  } = styles;
  return (
    <View style={{ paddingVertical: 3, paddingHorizontal: 10 }}>
      <Text style={{
        fontFamily: nameText,
        fontSize: nameSize,
        color,
      }}
      >
        {name}
      </Text>
      <View style={{
        alignContent: 'center',
        marginTop: 5,
        marginLeft: 10,
      }}
      >
        <Text
          style={{
            fontFamily: contentText,
            fontSize: contentSize,
            color,
          }}
          numberOfLines={1}
        >
          {content}
        </Text>
      </View>
    </View>
  );
};

function formatAccessibility(name, content, type) {
  switch (type) {
    case 'phone':
      return `Press to call ${name} at ${content}, long press to save their contact.`;
    case 'email':
      return `Press to email ${name} at ${content}, long press to save their contact.`;
    case 'link':
      return `Press to visit ${name}'s website.`;
    default:
      return `Press to ${type} ${name}.`;
  }
}

function contextOptions(type) {
  switch (type) {
    case 'email':
      return [
        { title: 'Save to Contacts' },
        { title: 'Share Email' },
      ];
    case 'phone':
      return [
        { title: 'Save to Contacts' },
        { title: 'Share Phone Number' },
      ];
    case 'link':
      return [
        { title: 'Share Link' },
      ];
    default:
      return [];
  }
}

function contextActions(option, name, content, type) {
  switch (option) {
    case 'Save to Contacts':
      switch (type) {
        case 'email':
          requestAddAlert(new Contact(name, { email: content }));
          break;
        default:
          requestAddAlert(new Contact(name, { phone: content }));
          break;
      }
      break;
    case 'Share Email':
    case 'Share Phone Number':
    case 'Share Link':
      Share.share({
        message: `${name}: ${formatContent(content, type)}\nShared from the Furman Now! app.`,
      });
      break;
    default:
      break;
  }
}

export default function ContactContentButton({
  name, content, priority, type,
}) {
  const { colors, fonts } = useTheme();
  const unpressedText = priority ? colors.emergencyText : colors.text;
  const unpressedButton = priority ? colors.emergency : colors.card;
  let linkPrefix = type === 'phone' ? 'tel:' : '';
  linkPrefix = type === 'email' ? 'mailto:' : linkPrefix;

  const styles = (pressed) => ({
    front: {
      backgroundColor: pressed
        ? colors.notification
        : unpressedButton,
      color: pressed
        ? colors.notificationText
        : unpressedText,
      borderRadius: 5,
      margin: 2,
      contentText: fonts.regular,
      contentSize: 14,
      nameText: fonts.bold,
      nameSize: 20,
    },
    button: {
      backgroundColor: pressed
        ? colors.notification
        : unpressedButton,
      color: pressed
        ? colors.notificationText
        : unpressedText,
      borderRadius: 8,
    },
  });

  return (
    <ContextMenu
      actions={contextOptions(type)}
      onPress={({ nativeEvent: { name: buttonName } }) => {
        contextActions(buttonName, name, content, type);
      }}
    >
      <Button
        onPress={() => { Linking.openURL(`${linkPrefix}${content}`); }}
        styles={styles}
        accessibilityLabel={name}
        accessibilityHint={formatAccessibility(name, content, type)}
        front={renderFront({
          name, content: formatContent(content, type),
        })}
        frontResponsive
      />
    </ContextMenu>
  );
}
ContactContentButton.propTypes = {
  name: PropTypes.string.isRequired,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  priority: PropTypes.bool,
  type: PropTypes.oneOf(['email', 'phone', 'link']).isRequired,
};
ContactContentButton.defaultProps = {
  priority: false,
};
