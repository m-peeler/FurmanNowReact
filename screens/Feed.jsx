import React from 'react';
import {
  View, FlatList,
  Dimensions,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import Carousel from 'react-native-reanimated-carousel';
import Page from '../utilities/Page';
import useDataLoadFetchCache from '../hooks/useDataLoadFetchCache';
import { parseDatetime } from '../utilities/DateTimeFunctions';
import NewsYoutubeCard from '../components/news/NewsYoutubeCard';
import NewsLinkCard from '../components/news/NewsLinkCard';

function datesAreWithin(first, second, milliseconds) {
  return Math.abs(first.getTime() - second.getTime()) < milliseconds;
}

function NewsItemCard({
  height, width, title, description, author, date, mediaType, section,
  link, imageLink, publisher, publisherLink, publisherImageLink,
}) {
  switch (mediaType) {
    case 'video':
      return (

        <NewsYoutubeCard
          height={height}
          width={width}
          title={title}
          description={description}
          author={author}
          date={date}
          section={section}
          link={link}
          imageLink={imageLink}
          publisher={publisher}
          publisherLink={publisherLink}
          publisherImageLink={publisherImageLink}
        />
      );
    case 'link':
    default:
      return (
        <NewsLinkCard
          height={height}
          width={width}
          title={title}
          description={description}
          author={author}
          date={date}
          section={section}
          link={link}
          imageLink={imageLink}
          publisher={publisher}
          publisherLink={publisherLink}
          publisherImageLink={publisherImageLink}
        />
      );
  }
}
NewsItemCard.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  publisher: PropTypes.string.isRequired,
  publisherLink: PropTypes.string.isRequired,
  mediaType: PropTypes.oneOf(['link', 'video']).isRequired,
  publisherImageLink: PropTypes.string,
  description: PropTypes.string,
  section: PropTypes.string,
  author: PropTypes.string,
  imageLink: PropTypes.string,
};
NewsItemCard.defaultProps = {
  publisherImageLink: undefined,
  description: undefined,
  author: undefined,
  imageLink: undefined,
  section: undefined,
};

function NewsCardStack({
  cardWidth, cardHeight, articles, sources,
}) {
  const isAndroid = Platform.OS === 'android';
  return (
    <Carousel
      loop
      snapEnabled
      {...{
        mode: isAndroid ? 'vertical-stack' : 'vertical-stack',
        modeConfig: {
          showLength: 3,
          stackInterval: cardHeight * 0.1,
          scaleInterval: 0.04,
          rotateZDeg: 50,
          snapDirection: 'left',
        },
      }
      }
      width={cardWidth}
      data={articles}
      height={cardHeight * (isAndroid ? 1 : 1.2)}
      renderItem={({ item: entry }) => (
        <NewsItemCard
          height={cardHeight}
          width={cardWidth}
          title={entry.title}
          link={entry.linktocontent}
          date={entry.date}
          publisher={sources[entry.publisherID].name}
          publisherLink={sources[entry.publisherID].link}
          publisherImageLink={sources[entry.publisherID].image}
          mediaType={entry.media}
          author={entry.author}
          section={entry.section}
          imageLink={entry.imagelink}
          description={entry.description}
        />
      )}
    />
  );
}
NewsCardStack.propTypes = {
  cardHeight: PropTypes.number.isRequired,
  cardWidth: PropTypes.number.isRequired,
  sources: PropTypes.shape().isRequired,
  articles: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      linktocontent: PropTypes.string,
      date: PropTypes.instanceOf(Date),
      publisherID: PropTypes.string,
      media: PropTypes.oneOf(['link', 'video']),
      author: PropTypes.string,
      section: PropTypes.string,
      imagelink: PropTypes.string,
      description: PropTypes.string,
    }),
  ).isRequired,
};

function collateSources(articles) {
  const collation = [];
  let current;
  articles.forEach((entry) => {
    if (current
      && current[0].publisherID === entry.publisherID
      && datesAreWithin(entry.date, current[0].date, 1000 * 60 * 3)) {
      current.push(entry);
    } else {
      if (current) collation.push(current.length > 1 ? current : current[0]);
      current = [entry];
    }
  });
  if (current) collation.push(current.length > 1 ? current : current[0]);
  return collation;
}

export default function Feed() {
  // const { navigation } = props;
  // const { navigate } = navigation;

  const [articles] = useDataLoadFetchCache(
    'https://cs.furman.edu/~csdaemon/FUNow/newsContentGet.php',
    'DATA:Articles',
    (fetch) => {
      if (fetch.results === undefined) return undefined;
      const results = fetch.results.map(
        (entry) => ({ ...entry, date: parseDatetime(entry.publishdate) }),
      );
      return collateSources(results);
    },
  );

  const [sources] = useDataLoadFetchCache(
    'https://cs.furman.edu/~csdaemon/FUNow/newsPublishersGet.php',
    'DATA:Publishers',
    (fetch) => {
      if (fetch.results === undefined) return undefined;
      return Object.fromEntries(
        fetch.results.map(({ publisherID, ...rest }) => [publisherID, rest]),
      );
    },
  );

  const cardWidth = Dimensions.get('window').width;
  const cardHeight = 270;

  return (
    <View style={{
      flex: 1, height: '100%', alignContent: 'center',
    }}
    >
      {articles
      && sources
      && (
      <FlatList
        data={articles}
        numColumns={1}
        renderItem={({ item }) => {
          if (Array.isArray(item)) {
            return (
              <NewsCardStack
                articles={item}
                sources={sources}
                cardHeight={cardHeight}
                cardWidth={cardWidth}
              />
            );
          }
          return (
            <NewsItemCard
              height={cardHeight}
              width={cardWidth}
              title={item.title}
              link={item.linktocontent}
              date={item.date}
              publisher={sources[item.publisherID].name}
              publisherLink={sources[item.publisherID].link}
              publisherImageLink={sources[item.publisherID].image}
              mediaType={item.media}
              author={item.author}
              section={item.section}
              imageLink={item.imagelink}
              description={item.description}
            />
          );
        }}
      />
      )}
    </View>
  );
}
Feed.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      pages: PropTypes.arrayOf(
        PropTypes.instanceOf(Page),
      ).isRequired,
    }).isRequired,
  }).isRequired,
};
