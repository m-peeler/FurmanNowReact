import { decode, encode } from "@googlemaps/polyline-codec";
import {Polyline, Callout} from "react-native-maps";
import {Text} from "react-native";
import React from "react";

export default function ModifiedPolyline(props){
    const coordinates = decode(props.encodedCoordinates, 5).map(
        (point) => {return {latitude: point[0], longitude: point[1]}}
    )

    return (
        <React.Fragment>
            <Polyline 
                {...props}
                strokeWidth={props.strokeWidth + 5}
                strokeColor={"#ffffff"}
                coordinates={coordinates}
            />
            <Polyline
                {...props}
                coordinates={coordinates}
            />
        </React.Fragment>
    )
}