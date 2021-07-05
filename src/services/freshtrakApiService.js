
require('dotenv').config();

const FRESHTRAK_API_HOST = process.env.REACT_APP_FRESHTRAK_API_HOST || "http://localhost:8888";
const CORS_URL = process.env.REACT_APP_CORS_URL || '';
const AGENCIES_PATH = "/api/agencies";
const ZIP_CODES_PATH = '/api/zip_codes';


//const FRESHTRAK_ZIPCODES_URL = `http://localhost:8888/api/zip_codes?zip_code=`;
export async function getAgencies(zipCode, lat, long) {
  let query = '';
  if (lat !== '' && long !== '')
    query = `?zip_code=${zipCode}&lat=${lat}&long=${long}`;
  else
    query = `?zip_code=${zipCode}`;
  const response = await fetch(CORS_URL+FRESHTRAK_API_HOST+AGENCIES_PATH+query, {
    headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3001',
    },
    mode: 'cors'
  })
  .then(response => {
  if (response.status >= 200 && response.status <= 299) {
    return response;
  }
  else 
    throw Error(response.statusText);
  });
  return(response);
}

export async function getZipCode(zipCode) {
    const query = `?zip_code=${zipCode}`;
    //const response = await fetch(CORS_URL+FRESHTRAK_API_HOST+ZIP_CODES_PATH+query, {
    const response = await fetch("http://localhost:8888"+ZIP_CODES_PATH+query, {
      headers: {
          'Content-Type': 'application/json',
          'accept': '*/*',
      },
      mode: 'cors'
    })
    .then(response => {
    if (response.status >= 200 && response.status <= 299) {
      return response;
    }
    else {
      throw Error(response.statusText);
    }});
    return(response);
  }