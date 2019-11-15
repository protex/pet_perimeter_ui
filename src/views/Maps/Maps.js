import React from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  Polygon,
  EditControl 
} from "react-google-maps";
import axios from 'axios';

const CustomSkinMap = withScriptjs(
  withGoogleMap((props) => (
    <GoogleMap
      defaultZoom={13}
      defaultCenter={{lat: 33.641529921065796, lng: -99.87394831347444}}
    >
      {props.polys}
    </GoogleMap>
  ))
);


const defaultState = {
  paths: [],
  isFetching: false,
  error: null
}
class Maps extends React.Component {

  axiosSource = null;

  state = defaultState;

  _poly = React.createRef();

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
          paths: [...state.paths, ...action.payload]
        }
      case "error":
        return {
          ...state,
          isFetching: false,
          error: action.payload
        }
    }
  }

  dispatch(action) {
    this.setState(previousState => this.reducer(previousState, action));
  }
  
  async cancel() {
    if (this.axiosSource)
      await this.axiosSource.cancel()
  }

  async getPaths() {
    await this.cancel()
    this.axiosSource = axios.CancelToken.source();
    axios.get("http://localhost:5000/perimeter/1/1", {
        cancelToken: this.axiosSource.token
      })
      .then(response => {
        this.dispatch({ type: "fetched", payload: response.data });
        console.log(response.data)
      })
      .catch(error => {
        this.dispatch({ type: "error", payload: error });
      });
  }

  async updatePaths(newPath) {
    await this.cancel()
    this.axiosSource = axios.CancelToken.source();
    axios.post("http://localhost:5000/perimeter/update/1/0", newPath, {
        cancelToken: this.axiosSource.token
      })
      .catch(error => {
        this.dispatch({ type: "error", payload: error });
      });
  }

  componentDidMount() {
    this.getPaths();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.url !== this.props.url) {
      this.getPaths();
    }
  }

  componentWillUnmount() {
    this.cancel();
  }

  onMouseUp() {
    let newPath = this._poly.current.getPath().g;
    this.updatePaths(newPath)
  }

  render() {
    return (
      <CustomSkinMap
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAmGGnInHfIFSOo4bgA4e-fvRU3TewyqdM"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100vh` }} />}
        mapElement={<div style={{ height: `100%` }} />}
        polys={[
        <Polygon path={this.state.paths[0]} 
          editable={true}
          draggable={true}
          onMouseUp={this.onMouseUp.bind(this)}
          ref={this._poly}
        />]}
      >
      </CustomSkinMap>
    );
  }
}

export default Maps
