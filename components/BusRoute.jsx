import React from 'react';
import PropTypes from 'prop-types';
import ModifiedPolyline from './ModifiedPolyline';
import BusStopMarker from './BusStopMarker';

function calculateETA(distAway, stopsAway, averageSpeed, updated) {
  const minsUntil = 60 * (distAway / averageSpeed) + (0.3 * stopsAway);
  const timeOfArrival = updated.getTime() + (1000 * 60 * minsUntil);
  return new Date(timeOfArrival);
}

function writeETAString(eta, vehicleName) {
  const name = vehicleName ? vehicleName.trim() : 'vehicle';
  const arrivalString = `${((eta.getHours() - 1) % 12) + 1}:${eta.getMinutes() < 10 ? '0' : ''}${eta.getMinutes()} ${eta.getHours() >= 12 && eta.getHours() !== 24 ? 'pm' : 'am'}`;
  const timeTill = Math.floor((eta.getTime() - Date.now()) / (1000 * 60));
  let message = `The ${name} should arrive around ${arrivalString} (${timeTill} minutes from now).`;
  if (timeTill < -0.5) { message = 'I think you missed the bus &#128556;'; }
  if (timeTill < 1) { message = `The ${name} is pulling up right now.`; }
  return message;
}

export default function BusRoute({
  color, route, stops, website, vehicleName, averageSpeed,
}) {
  const stopMarkers = stops && stops[0]
    ? stops.map(({
      name, coordinate, vehicleStopsUntil, distFromVehicle, updated,
    }) => (
      <BusStopMarker
        key={name}
        title={name}
        color={color}
        eta={(vehicleStopsUntil !== undefined && vehicleStopsUntil !== '') && (distFromVehicle !== undefined && vehicleStopsUntil !== '')
          ? writeETAString(
            calculateETA(vehicleStopsUntil, distFromVehicle, averageSpeed, updated),
            vehicleName,
          )
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
