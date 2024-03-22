import React from 'react';
import {
  View, FlatList,
  Dimensions
  ,
} from 'react-native';
import PropTypes from 'prop-types';
import Page from '../utilities/Page';
import useDataLoadFetchCache from '../hooks/useDataLoadFetchCache';
import { parseDatetime } from '../utilities/DateTimeFunctions.ts';
import { Article } from '../utilities/ArticleFunctions.ts';
import NewsItemCard from '../components/news/NewsItemCard';
import NewsCardStack from '../components/news/NewsCardStack';

function datesAreWithin(first, second, milliseconds) {
  return Math.abs(first.getTime() - second.getTime()) < milliseconds;
}

function collateSources(articles) {
  const collation = [];
  let current;
  articles.forEach((entry) => {
    if (current
      && current[0].publisherID === entry.publisherID
      && datesAreWithin(entry.date, current[0].date, 1000 * 60 * 60 * 4)) {
      current.unshift(entry);
    } else {
      if (current) collation.push(current.length > 1 ? current : current[0]);
      current = [entry];
    }
  });
  if (current) collation.push(current.length > 1 ? current : current[0]);
  return collation;
}

export default function Feed() {
  const [articles] = useDataLoadFetchCache(
    'https://cs.furman.edu/~csdaemon/FUNow/newsContentGet.php',
    'DATA:Articles',
    (fetch) => {
      if (fetch.results === undefined) return undefined;
      const results = fetch.results.map(
        (entry) => (new Article(
          entry.title,
          entry.linktocontent,
          parseDatetime(entry.publishdate),
          entry.publisherID,
          entry.media,
          entry.author,
          entry.section,
          entry.imagelink,
          entry.description,
        )),
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
              article={item}
              publisher={sources[item.publisherID].name}
              publisherLink={sources[item.publisherID].link}
              publisherImageLink={sources[item.publisherID].image}
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
