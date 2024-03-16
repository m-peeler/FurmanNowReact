import React from 'react';
import PropTypes from 'prop-types';
import ModifiedPolyline from './ModifiedPolyline';
import BusStopMarker from './BusStopMarker';

function calculateETA(distAway, stopsAway, updated) {
  const minsUntil = 60 * (distAway / 30) + (0.5 * stopsAway);
  const timeOfArrival = updated.getTime() + (1000 * 60 * minsUntil);
  return new Date(timeOfArrival);
}

function writeETAString(eta, vehicleName) {
  const name = vehicleName ? vehicleName.trim() : 'vehicle';
  const timeTill = (eta.getTime() - Date.now()) / (1000 * 60);
  console.log(timeTill);
  let message = `The ${name} is ~${Math.floor(timeTill)} minutes away.`;
  if (timeTill < -1) { message = 'I think you missed the bus &#128556'; }
  if (timeTill < 1) { message = `The ${name} is pulling up right now.`; }
  if (timeTill < 2) { message = `The ${name} is ~1 minute away.`; }
  return message;
}

export default function BusRoute({
  color, route, stops, website, vehicleName,
}) {
  const stopMarkers = stops && stops[0]
    ? stops.map(({
      name, coordinate, vehicleStopsUntil, distFromVehicle, updated,
    }) => (
      <BusStopMarker
        key={name}
        title={name}
        color={color}
        eta={vehicleStopsUntil !== undefined && distFromVehicle !== undefined
          ? writeETAString(calculateETA(vehicleStopsUntil, distFromVehicle, updated), vehicleName)
          : `The ${vehicleName} doesn't seem to be running right now.`}
        coordinate={coordinate}
        website={website}
        vehicleName={vehicleName}
      />
    ))
    : [];

  return [
    <ModifiedPolyline
      key={vehicleName}
      encodedCoordinates={route}
      strokeColor={color}
      strokeWidth={9}
      lineJoin="round"
    />,
    ...stopMarkers];
}
BusRoute.propTypes = {
  color: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired,
  stops: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    coordinate: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    }).isRequired,
    vehicleStopsUntil: PropTypes.number,
    distFromVehicle: PropTypes.number,
    updated: PropTypes.instanceOf(Date),
  })).isRequired,
  website: PropTypes.string,
  vehicleName: PropTypes.string.isRequired,
};
