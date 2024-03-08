import { useEffect, useState } from 'react';
import useDataLoadFetchCache from './useDataLoadFetchCache';
import { parseTime } from '../utilities/DateTimeFunctions';
import * as Scheduling from '../utilities/Scheduling.ts';
import arrayPartition from '../utilities/ArrayFunctions';

function sortAndCollateHours(hoursList) {
  const value = hoursList.sort(((e1, e2) => {
    const ord = Number(e1.dayorder > e2.dayorder) - Number(e2.dayorder > e1.dayorder);
    if (ord === 0) return e1.Start.localeCompare(e2.Start);
    return ord;
  }));
  const sched = new Scheduling.Schedule();
  value.forEach((hour) => sched.addHourRangeToDay(
    Scheduling.Schedule.getDOWFromString(hour.day),
    new Scheduling.HourRange(
      parseTime(hour.Start),
      parseTime(hour.End),
    ),
  ));
  return sched;
}

function joinBuildingInfo(hoursData, buildingData) {
  if (hoursData === undefined
    || buildingData === undefined
    || hoursData.length === 0
    || buildingData.length === 0) {
    return null;
  }

  const collated = hoursData.map(
    (hours) => sortAndCollateHours(hours),
  );
  const joined = collated.map(
    (hours, index) => [buildingData[index].name,
      {
        ...buildingData[index],
        schedule: hours,
        lastUpdated: hoursData[index][0].lastUpdated,
      },
    ],
  );
  return joined;
}

export default function useBuildingHours() {
  const [hoursData] = useDataLoadFetchCache(
    'https://cs.furman.edu/~csdaemon/FUNow/hoursGet.php',
    'DATA:Building-Hours-Cache',
    (json) => {
      arrayPartition(json, 'buildingID');
    },
  );

  const [buildingData] = useDataLoadFetchCache(
    'https://cs.furman.edu/~csdaemon/FUNow/buildingGet.php',
    'DATA:Building-Info-Cache',
    (json) => {
      const buildings = Object.fromEntries(
        json.results.map(
          (item) => [item.buildingID, item],
        ),
      );
      const output = Object.keys(buildings).length > 0 ? buildings : null;
      return output;
    },
  );

  const [data, setData] = useState();
  const [dataExists, setDataExists] = useState(false);

  useEffect(() => {
    if (hoursData === undefined || buildingData === undefined) return;
    const structured = joinBuildingInfo(hoursData, buildingData);
    setData(structured);
    setDataExists(true);
  }, [hoursData, buildingData]);

  return [data, dataExists];
}