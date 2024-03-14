import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@react-navigation/native';
import { View, Linking, Share } from 'react-native';
import ContextMenu from 'react-native-context-menu-view';
// eslint-disable-next-line import/no-extraneous-dependencies
import Clipboard from '@react-native-clipboard/clipboard';

export default function NewsCardWrapper({
  children, height, width, color, publisher, publisherLink, link, title,
}) {
  const { colors } = useTheme();
  const style = {
    borderRadius: 10,
    backgroundColor: color,
    marginVertical: 10,
    marginHorizontal: 5,
    height: height - 2 * 5,
    width: width - 2 * 5,
    shadowColor: colors.shadow,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    elevation: 5,
  };
  return (
    <ContextMenu
      actions={
      [{ title: 'Share Article' },
        { title: 'Copy Article Link' },
        {
          title: `${publisher}`,
          actions: [
            { title: `Visit ${publisher}` },
            { title: 'Copy Website' },
            { title: 'Share Website' }],
        },
      ]
}
      onPress={({ nativeEvent }) => {
        const { indexPath } = nativeEvent;
        switch (indexPath[0]) {
          case 0:
            Share.share({
              message:
          `"${title}" – ${link}\n\nArticle from ${publisher}, through the Furman Now! app.`,
            });
            break;
          case 1:
            Clipboard.setString(link);
            break;
          case 2:
            switch (indexPath[1]) {
              case 0:
                Linking.openURL(publisherLink);
                break;
              case 1:
                Clipboard.setString(`${publisherLink}`);
                break;
              case 2:
                Share.share({ message: `Check out ${publisher}: ${publisherLink}\nShared from the Furman Now! app.` });
                break;
              default:
                break;
            }
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
  title: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  publisher: PropTypes.string.isRequired,
  publisherLink: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
};
