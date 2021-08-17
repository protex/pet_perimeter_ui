/*
 * ReactComponent: CustomSkinMap
 * Description: Wrapper to inject google maps into different components
 */
import React from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap
} from "react-google-maps";
import axios from 'axios';
import HeatmapLayer from "react-google-maps/lib/components/visualization/HeatmapLayer";
import { getUserDevicePath } from 'assets/utils/getUserDevicePath.js'
const CustomSkinMap = withScriptjs(
  withGoogleMap((props) => (
    <GoogleMap
      defaultZoom={13}
      defaultCenter={{lat: 33.58312281918583, lng: -99.79254923459825}}
      onClick={props.onClick ? props.onClick.bind(this) : null}
      onRightClick={() => {
        let perimeter = [
            {"lat": 33.641529921065796, "lng": -99.87394831347444},
            {"lat": 33.63381235351977, "lng": -99.86433527636507},
            {"lat": 33.638957475400886, "lng": -99.84236262011507},
            {"lat": 33.64924679692315, "lng": -99.84888575243929}
        ]
        axios.post(`http://${window.location.hostname}:5000/perimeter/update/` + getUserDevicePath().split("/")[1] + "/0", 
          perimeter)
          .catch(error => {
            this.dispatch({ type: "error", payload: error });
            console.log(error)
          });
      }}
    >
      {props.polys}
      {props.lastLocationMarker}
      {props.heatMapData ? 
        <HeatmapLayer
          data={props.heatMapData.map((item) => {
            return new window.google.maps.LatLng(item.lat, item.lng);
          })}
          options={{radius: 20}}
          key={0}
        />
      : null}
    </GoogleMap>
  ))
);
export default CustomSkinMap;
