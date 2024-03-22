import useDataLoadFetchCache from './useDataLoadFetchCache';
import { isAllDay, parseDatetime } from '../utilities/DateTimeFunctions.ts';
import arrayPartition from '../utilities/ArrayFunctions';
import { dateCompare } from '../utilities/Scheduling.ts';

function partitionByTimeRange(json) {
  const parsed = json.results.map((item) => {
    const eventdate = parseDatetime(item.eventdate);
    const rtrn = { ...item, eventdate, allDay: isAllDay(eventdate) };
    return rtrn;
  });
  const today = new Date(Date.now());
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const partitioned = arrayPartition(parsed, (item) => {
    const comparedToToday = dateCompare(item.eventdate, today);
    if (comparedToToday < 0 || item.resultStatus !== '') return 'Results';
    if (comparedToToday === 0) return 'Today';
    if (dateCompare(item.eventdate, tomorrow) === 0) return 'Tomorrow';
    if (dateCompare(item.eventdate, nextWeek) < 0) return 'This';
    return 'Next';
  });
  const compForSort = (a, b) => (a.eventdate > b.eventdate) - (a.eventdate < b.eventdate);
  let output = [];
  // If there are elements in it, adds each sorted
  // list (prefixed by its header) to the output list
  output = [
    ...(partitioned.Results !== undefined
      ? [{ heading: 'RESULTS' },
        ...partitioned.Results.sort(compForSort)]
      : []),
    ...(partitioned.Today !== undefined
      ? [{ heading: 'TODAY', date: today },
        ...partitioned.Today.sort(compForSort)]
      : []),
    ...(partitioned.Tomorrow !== undefined
      ? [{ heading: 'TOMORROW', date: tomorrow },
        ...partitioned.Tomorrow.sort(compForSort)]
      : []),
    ...(partitioned.This !== undefined
      ? [{ heading: 'THIS WEEK' },
        ...partitioned.This.sort(compForSort)]
      : []),
    ...(partitioned.Next !== undefined
      ? [{ heading: 'NEXT WEEK' },
        ...partitioned.Next.sort(compForSort)]
      : []),
  ];
  return output;
}

export default function useAthleticsCalendar() {
  return useDataLoadFetchCache(
    'https://cs.furman.edu/~csdaemon/FUNow/athleticsGet.php',
    'DATA:Athletics-Cache',
    (json) => partitionByTimeRange(json),
  );
}
