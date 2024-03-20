import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@react-navigation/native';
import {
  View, Pressable, Text,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import NewsCardWrapper from './NewsCardWrapper';
import NewsLinkCard from './NewsLinkCard';

export default function NewsYoutubeCard(
  {
    height,
    width,
    title,
    description,
    author,
    date,
    section,
    link,
    publisher,
    publisherLink,
    publisherImageLink,
  },
) {
  const [pressed, setPressed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const videoID = link.split('/').at(-1);
  const { colors, fonts } = useTheme();
  const thumbnail = `https://i.ytimg.com/vi/${videoID}/hqdefault.jpg`;
  const playerPadding = 10;
  const normalCard = (
    <NewsLinkCard
      height={height}
      width={width}
      title={title}
      description={description}
      author={author}
      date={date}
      section={section}
      link={link}
      imageLink={thumbnail}
      publisher={publisher}
      publisherLink={publisherLink}
      publisherImageLink={publisherImageLink}
      onPress={() => setPlaying(!playing)}
      touchState={{ state: pressed, setter: setPressed }}
    />
  );

  const videoPlayingCard = (
    <NewsCardWrapper
      height={height}
      width={width}
      color={colors.card}
      headline={title}
      link={link}
      publisher={publisher}
      publisherLink={publisherLink}
    >
      <View style={{
        position: 'absolute',
        top: playerPadding,
        left: playerPadding,
        borderRadius: 5,
        width: width - 2 * playerPadding,
      }}
      >
        <YoutubePlayer
          width={width - (10 + (2 * playerPadding))}
          height={(width - (10 + (2 * playerPadding))) * (9 / 16)}
          videoId={videoID}
          play={playing}
          initialPlayerParams={{}}
        />
        <Pressable
          onPress={() => setPlaying(!playing)}
          onTouchStart={() => setPressed(true)}
          onTouchEnd={() => setPressed(false)}
          onTouchCancel={() => setPressed(false)}
        >
          <Text
            numberOfLines={1}
            style={{
              paddingBottom: 5,
              paddingHorizontal: 5,
              position: 'absolute',
              top: 10,
              fontFamily: fonts.bold,
              fontSize: 20,
              color: colors.text,
            }}
          >
            {title}
          </Text>
        </Pressable>
      </View>
    </NewsCardWrapper>
  );
  return (
    playing ? videoPlayingCard : normalCard
  );
}
NewsYoutubeCard.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  publisher: PropTypes.string.isRequired,
  publisherLink: PropTypes.string.isRequired,
  publisherImageLink: PropTypes.string,
  description: PropTypes.string,
  section: PropTypes.string,
  author: PropTypes.string,
};
NewsYoutubeCard.defaultProps = {
  publisherImageLink: undefined,
  description: undefined,
  author: undefined,
  section: undefined,
};
