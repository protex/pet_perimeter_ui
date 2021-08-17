import React from "react";
import {
  Marker,
  Polygon
} from "react-google-maps";
import axios from 'axios';
import CustomSkinMap from './CustomSkinMap.js'
import { getUserDevicePath } from 'assets/utils/getUserDevicePath.js'
import ip from 'ip';

const defaultState = {
  paths: [],
  isFetching: false,
  error: null,
  lastLocation: {}
}
class Maps extends React.Component {

  axiosSource = null;

  state = defaultState;

  _poly = React.createRef();

  autoUpdateLocation = null;

  ip_addr = ip.address();

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
          lastLocation: action.payload.lastLocation || {...this.state.lastLocation},
          paths: [...state.paths, ...action.payload.paths || []]
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

  dispatch(action) {
    console.log(action)
    this.setState(previousState => this.reducer(previousState, action));
  }
  
  async cancel() {
    if (this.axiosSource)
      await this.axiosSource.cancel()
  }

  async getPaths() {
    await this.cancel()
    this.axiosSource = axios.CancelToken.source();
    try {
      let paths = await axios.get(`http://${window.location.hostname}:5000/perimeter/1/1`, {
          cancelToken: this.axiosSource.token
      });
      paths = paths.data;
      this.dispatch({type: "fetched", payload: {paths}})
    } catch (err) {
      this.dispatch({type: "error", payload: err});
    }
  }

  async getCurrentLocation() {
    await this.cancel()
    this.axiosSource = axios.CancelToken.source();
    try {
      let locationData = await axios.get(`http://${window.location.hostname}:5000/location` + getUserDevicePath(), {
        cancelToken: this.axiosSource.token
      })
      let lastLocation = locationData.data[0];
      this.dispatch({type: "fetched", payload: {lastLocation}})
    } catch (err) {
      this.dispatch({type: "error", payload: err});
    }
  }

  async updatePaths(newPath) {
    await this.cancel()
    this.axiosSource = axios.CancelToken.source();
    axios.post(`http://${window.location.hostname}:5000/perimeter/update/` + getUserDevicePath().split("/")[1] + "/0", newPath, {
        cancelToken: this.axiosSource.token
      })
      .catch(error => {
        this.dispatch({ type: "error", payload: error });
        console.log(error)
      });
  }

  componentDidMount() {
    this.getPaths();
    this.getCurrentLocation();
    this.autoUpdateLocation = window.setInterval(() => {
      this.getCurrentLocation();
    }, 5000);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.url !== this.props.url) {
      this.getPaths();
    }
  }

  componentWillUnmount() {
    this.cancel();
    clearInterval(this.autoUpdateLocation);
  }

  onMouseUp() {
    let newPath = this._poly.current.getPath().g;
    this.updatePaths(newPath)
  }

  deletePolygon() {
    this.updatePaths([]);
  }

  render() {
    return (
      <CustomSkinMap
        googleMapURL={`https://maps.googleapis.com/maps/api/js?libraries=visualization,drawing&key=${process.env.REACT_APP_MAPS_API_KEY}`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100vh` }} />}
        mapElement={<div style={{ height: `100%` }} />}
        polys={[
        <Polygon path={this.state.paths[0]} 
          editable={true}
          draggable={true}
          onMouseUp={this.onMouseUp.bind(this)}
          onDblClick={this.deletePolygon.bind(this)}
          ref={this._poly}
          key={0}
          visible={(this.state.paths[0] || []) !== [] }
        />]}
        lastLocationMarker={<Marker position={{"lat": parseFloat(this.state.lastLocation.lat), "lng": parseFloat(this.state.lastLocation.lng)}} />}
        drawPoly={this.drawPoly}
      />
    );
  }
}

export default Maps
