
import './App.css';
import React, {useState, useEffect } from 'react';
import { getAgencies } from './services/freshtrakApiService.js';
//import { getAgencies, getZipCode } from './services/freshtrakApiService.js';
import { Map, TileLayer, CircleMarker, Marker, Popup } from 'react-leaflet';
import { ZipForm } from './ZipForm.js';
import {zipCodesbyLocation, getZipCode} from './services/geonamesApiService.js';

let center = [39.9612, -82.9988];
let userZipCode = '';
let zoom = 12;
let height = window.innerHeight *.85;
let width = window.Width

function App() {
  const [agencies, setAgencies] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [zipCodeUpdated, setZipCodeUpdated] = useState(false);
  const [checkedUserLocation, setCheckedUserLocation] = useState(false);
  const [userLocationMsg, setUserLocationMsg] = useState('');
  const [zipCodeRetrieved, setZipCodeRetrieved] = useState(false);
  const [userLocationUpdated, setUserLocationUpdated] = useState(false);
  const [haveUserLocation, setHaveUserLocation] = useState(false);
  const [filteredDistance, setFilteredDistance] = useState(10);
  

  useEffect(() => {
    if (!checkedUserLocation) 
      getUserLocation();

    if (haveUserLocation)
      getZipCodesByLocation(center[0], center[1]).then(() => {
        setHaveUserLocation(false);
      });

    if(userLocationUpdated) {
      setZipCode(userZipCode);
      setUserLocationMsg("Using Your Device Location");
      getAgencyData()
      .then(setUserLocationUpdated(false))
    }     

    if (zipCodeUpdated) {
      getZipCodeData(zipCode).then(() => {
        if (zipCodeRetrieved) {
          getAgencyData();
        }
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agencies, zipCodeUpdated, zipCodeRetrieved, userLocationUpdated, haveUserLocation, checkedUserLocation]);
  
  
  async function getAgencyData() {
    if (zipCode === '')
      return;
    let lat = '';
    let lng = '';
    if (userLocationUpdated || zipCode === userZipCode) {
      lat = center[0];
      lng = center[1];
    }
    await getAgencies(zipCode, lat, lng)
      .then(res => res.json())
      .then(res => {
        if (JSON.stringify(res) === '{}')
          throw Error(`No Agencies Found with Zip Code`);
        const filteredAgencies = res.agencies.filter( (agency) => {
          return (agency.estimated_distance < filteredDistance && agency.events.length !== 0);
        });
        setAgencies(filteredAgencies);
        setZipCodeRetrieved(false);
        if (filteredAgencies.length === 0)
          throw Error(`No Agencies Found within ${filteredDistance} miles of ${zipCode}`);
      })
      .catch((error) => {
        setErrorMsg(`Agencies ${error}`)
      });
  }

  async function getZipCodeData(zipCode) {
    if (zipCode === '')
      return;
    
    await getZipCode(zipCode)
      .then(res => res.json())
      .then(res => {
        //if (JSON.stringify(res) === '{}')
        if (res.postalcodes.length === 0)
          throw Error(`Zip Code not found`);
        //center = [res.zip_codes[0].latitude, res.zip_codes[0].longitude]; 
        center = [res.postalcodes[0].lat, res.postalcodes[0].lng]; 
        setZipCodeRetrieved(true);     
        setZipCodeUpdated(false);
        setUserLocationMsg('');
        setErrorMsg('');
      })
      .catch((error) => {
        setErrorMsg(`ZipCodes ${error}`);
        setZipCodeUpdated(false);
        setZipCodeRetrieved(false);
      });
  }

  async function getZipCodesByLocation(lat, lng) {
    await zipCodesbyLocation(lat, lng)
    .then(res => res.json())
    .then(res => {
      userZipCode = res.postalCodes[0].postalCode;
      setUserLocationUpdated(true); 
      setHaveUserLocation(false);
    })
    .catch((error) => {
      setErrorMsg(`ZipCodesByLocation ${error}`);
    }); 
  }

  async function getUserLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        center = [position.coords.latitude, position.coords.longitude];
        setHaveUserLocation(true);
      }
    )}else {
      setUserLocationMsg("Geolocation not supported by this broswer.");
    }; 
    setCheckedUserLocation(true);
  }

  return (
    <div className="App">
      <div className="heading">
        <h4 className="header">FreshTrak Agencies Locator</h4>
        <h5 style={{color: 'green'}}>{ userLocationMsg }</h5>
      </div>
      <div className="zip-form">  
      <ZipForm 
        zipCode={zipCode}
        setZipCode={setZipCode}
        filteredDistance={filteredDistance}
        setFilteredDistance={setFilteredDistance}
        zipCodeUpdated={zipCodeUpdated}
        setZipCodeUpdated={setZipCodeUpdated}
        errorMsg={errorMsg}
        setErrorMsg={setErrorMsg}
      />        
      </div>
      <div className="error-msg">
        {errorMsg}
      </div>
      <div className="map-container">
        <Map
          tap={false} //needed for Safari browser
          center={center}
          zoom={zoom}
          width={width}
          height={height}
          style={{height: height + 'px'}}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <CircleMarker
            center={center}
            color="green"
            fillColor="red"
            radius={8}
            fillOpacity={.6}
            stroke={false}
          ></CircleMarker>
          {agencies.map(agency => {
            return (
              <Marker 
                position={[
                  agency.events[0].latitude,
                  agency.events[0].longitude
                ]}
                key={agency['id']}>
                
                <Popup>
                  <div className="info-box">
                    <div className="content">
                      <h2> Agency </h2>
                      <h4> Name </h4>
                      <p>{(agency.name)}</p>
                      <h4> Address </h4>
                      <p>{(agency.address)}</p>
                      <p>{(agency.city)}{'\u00A0'}{'\n'}{agency.state}{'\u00A0'}{agency.zip}</p>
                      <h4>Estimated Distance</h4>
                      <p>{(agency.estimated_distance)}m</p>
                      <a href={`https://freshtrak.com/agency/events/${agency.id}`} target="_blank" rel="noreferrer"> Upcoming Resource Events </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            )
          })
        }
        </Map>
      </div>
    </div>
  );
}
export default App;