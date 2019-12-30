/* 
 * ReactComponent: HeatMap
 * Description: Displays heatmap of pets location
 */
import React from "react";
import axios from 'axios';
import CustomSkinMap from './CustomSkinMap.js'
import { getUserDevicePath } from 'assets/utils/getUserDevicePath.js'

const defaultState = {
  locationData: [],
  isFetching: false,
  error: null,
}
class HeatMap extends React.Component {

  axiosSource = null;

  state = defaultState;

  _poly = React.createRef();

  interval = null;

  /*
   * function: reducer
   * description: Takes in previous state, determines new state based on action
   */
  reducer(state, action) {
    switch(action.type) {
      case "fetch":
        return {
          ...state,
          isFetching: true
        }
      case "fetched":
        return {
          ...state,
          isFetching: false,
          locationData: [...state.locationData, ...action.payload.locationData|| []]
        }
      case "error":
        return {
          ...state,
          isFetching: false,
          error: action.payload
        }
      default:
        return {...state}
    }
  }

  /*
   * function: dispatch
   * description: Sets a new state for the component
   */
  dispatch(action) {
    this.setState(previousState => this.reducer(previousState, action));
  }
  
  /* 
   * function: cancel
   * description: Cancels ongoing axios request
   */
  async cancel() {
    if (this.axiosSource)
      await this.axiosSource.cancel()
  }

  /*
   * function: getLocationData
   * description: Gets the location data
   *  from the api needed to display the heatmap
   */
  async getLocationData() {
    await this.cancel()
    this.axiosSource = axios.CancelToken.source();
    try {
      let locationData = await axios.get("http://localhost:5000/location" + getUserDevicePath(), {
        cancelToken: this.axiosSource.token
      })
      locationData = locationData.data;
      this.dispatch({type: "fetched", payload: {locationData}})
    } catch (err) {
      this.dispatch({type: "error", payload: err});
    }
  }


  /* function: componentDidMount
   * description: Triggers getLocationData when the
   *  component is mounted
   */
  componentDidMount() {
    this.getLocationData();
  }

  async onClick(event) {
    await this.cancel();
    console.log(event.latLng.lat(), event.latLng.lng())
    this.axiosSource = axios.CancelToken.source();
    try {
      await axios.post("http://localhost:5000/location/" + getUserDevicePath().split("/")[1], 
        [{"lat": event.latLng.lat(), "lng": event.latLng.lng()}], {cancelToken: this.axiosSource.token})
      await this.getLocationData();
    } catch (err) {
      this.dispatch({type: "error", payload: err});
    }
  }


  /*
   * function: componentWillUnmount
   * description: Cancels any ongoing requests
   *  before the component is destroyed
   */
  componentWillUnmount() {
    this.cancel();
  }

  /*
   * function: render
   * description: Defines the viewable portion of the component
   */
  render() {
    return (
      <CustomSkinMap
        googleMapURL={`https://maps.googleapis.com/maps/api/js?libraries=visualization,drawing&key=${process.env.REACT_APP_MAPS_API_KEY}`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100vh` }} />}
        mapElement={<div style={{ height: `100%` }} />}
        heatMapData={this.state.locationData}
        onClick={this.onClick.bind(this)}
      />
    );
  }
}

export default HeatMap
