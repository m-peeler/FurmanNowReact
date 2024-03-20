import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@react-navigation/native';
import { View, Linking, Share } from 'react-native';
import ContextMenu from 'react-native-context-menu-view';
// eslint-disable-next-line import/no-extraneous-dependencies
import Clipboard from '@react-native-clipboard/clipboard';

export default function NewsCardWrapper({
  children, height, width, color, publisher, publisherLink, link, headline,
}) {
  const { styling } = useTheme();
  const style = {
    borderRadius: 10,
    backgroundColor: color,
    marginVertical: 15,
    marginHorizontal: 5,
    height: height - 2 * 5,
    width: width - 2 * 5,
    ...styling.shadows,
  };
  const publisherActions = [
    { title: `Visit ${publisher}` },
    { title: 'Copy Website' },
    { title: 'Share Website' },
  ];
  const articleActions = [
    { title: 'Share News' },
    { title: 'Copy News Link' },
    {
      title: `${publisher}`,
      actions: publisherActions,
    },
  ];
  return (
    <ContextMenu
      actions={link && link !== '' ? articleActions : publisherActions}
      onPress={({ nativeEvent }) => {
        const { name } = nativeEvent;
        switch (name) {
          case 'Share News':
            Share.share({
              message:
          `"${headline}" – ${link}\n\nArticle from ${publisher}, through the Furman Now! app.`,
            });
            break;
          case 'Copy News Link':
            Clipboard.setString(link);
            break;
          case `Visit ${publisher}`:
            Linking.openURL(publisherLink);
            break;
          case 'Copy Website':
            Clipboard.setString(`${publisherLink}`);
            break;
          case 'Share Website':
            Share.share({ message: `Check out ${publisher}: ${publisherLink}\nShared from the Furman Now! app.` });
            break;
          default:
            break;
        }
      }}
    >
      <View style={style}>
        {children}
      </View>
    </ContextMenu>
  );
}
NewsCardWrapper.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  publisher: PropTypes.string.isRequired,
  publisherLink: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
  link: PropTypes.string,
  headline: PropTypes.string,
};
NewsCardWrapper.defaultProps = {
  link: undefined,
  headline: undefined,
};
