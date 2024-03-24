import { parseDate, parseTime } from '../utilities/DateTimeFunctions.ts';
import { dateCompare, HourRange } from '../utilities/Scheduling.ts';
import arrayPartition from '../utilities/ArrayFunctions';
import useDataLoadFetchCache from './useDataLoadFetchCache';

export default function useImportantDates() {
  return useDataLoadFetchCache(
    'https://cs.furman.edu/~csdaemon/FUNow/importantDateGet.php',
    'DATA:Dates-Cache',
    (resp) => {
      if (resp.results === undefined) return undefined;
      const parsed = resp.results.map(({
        date, startTime, endTime, ...rest
      }) => (
        {
          ...rest,
          date: parseDate(date),
          timeRange: new HourRange(parseTime(startTime), parseTime(endTime)),
        }
      ));
      return Object.entries(
        arrayPartition(parsed, 'category'),
      ).sort(([k1], [k2]) => k1.localeCompare(k2))
        .map(([key, value]) => [
          key,
          value.sort(({ date: d1 }, { date: d2 }) => dateCompare(d1, d2)),
        ]);
    },
  );
}
