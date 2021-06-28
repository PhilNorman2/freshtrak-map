
import './App.css';
import React, {useState, useEffect } from 'react';
import { getAgencies, getZipCode } from './services/freshtrakApiService.js';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { ZipForm } from './ZipForm.js'

function App() {
  const [agencies, setAgencies] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [errorMsg, setErrorMsg] = useState('');
  const [center, setCenter] = useState([40, -83]);
  const [zoom, setZoom] = useState(11.5);
  const [height, setHeight] = useState(window.innerHeight * 0.9);
  const [width, setWidth] = useState(window.Width * 0.9);
  const [zipCode, setZipCode] = useState('43215');
  const [zipCodeUpdated, setZipCodeUpdated] = useState(false);
  const [checkedUserLocation, setCheckedUserLocation] = useState(false);
  const [usingUsersLocation, setUsingUsersLocation] = useState('');
  const [zipCodeRetrieved, setZipCodeRetrieved] = useState(false);

  useEffect(() => {
    if (!checkedUserLocation) 
      getUserLocation();

    if (zipCodeUpdated) {
      getZipCodeData(zipCode).then(() => {
        if (zipCodeRetrieved) {
          getAgencyData()
        }
      })
    }

   if(agencies.length === 0)
     getAgencyData();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agencies, zipCodeUpdated, zipCodeRetrieved]);
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function getAgencyData() {
    await getAgencies(zipCode)
      .then(res => res.json())
      .then(res => {
        if (JSON.stringify(res) === '{}')
          throw Error(`No Agencies Found with Zip Code`);
        setAgencies(res.agencies);
        setZipCodeRetrieved(false);
      })
      .catch((error) => {
        setErrorMsg(`Agencies ${error}`)
      });
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function getZipCodeData(zipCode) {
    // eslint-disable-next-line no-unused-vars
    const result = await getZipCode(zipCode)
      .then(res => res.json())
      .then(res => {
        if (JSON.stringify(res) === '{}')
          throw Error(`No Agencies Found Within the Zip Code`);
        setCenter([res.zip_codes[0].latitude, res.zip_codes[0].longitude]); 
        setZipCodeRetrieved(true);     
        setZipCodeUpdated(false);
        setUsingUsersLocation('');
        setErrorMsg('');
      })
      .catch((error) => {
        setErrorMsg(`ZipCodes ${error}`);
        setZipCodeUpdated(false);
        setZipCodeRetrieved(false);
      });
  }

  function getUserLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        setCenter([position.coords.latitude, position.coords.longitude])
        setUsingUsersLocation("Using Your Device's Location");
      });
    }
    setCheckedUserLocation(true);
  }

  return (
    //agencies.map(agency => ({latitude: agency.events[0].latitude, longitude: agency.events[0].longitude}))
    
    <div className="App"> 
      <p style={{color: "green"}}>{ usingUsersLocation} </p>
      <p style={{color: "red"}}>{ errorMsg } </p>

      <div className="ZipCode">
        <p/>
        <ZipForm 
          zipCode={zipCode}
          setZipCode={setZipCode}
          zipCodeUpdated={zipCodeUpdated}
          setZipCodeUpdated={setZipCodeUpdated}
          errorMsg={errorMsg}
          setErrorMsg={setErrorMsg}
        />
      </div>
        <Map
          //tap={false} //needed for Safari browser
          center={center}
          zoom={zoom}
          width={width}
          height={height}
          style={{height: height + 'px'}}
          //onClick={this.addMarker}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
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
                    </div>
                  </div>
                </Popup>
              </Marker>
            )
          })
        }
        </Map>
      </div>
  );
}
export default App;