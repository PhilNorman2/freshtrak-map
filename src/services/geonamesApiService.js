require('dotenv').config();

console.log(`process.env.CORS_URL ${process.env.REACT_APP_CORS_URL}`);
const GEONAMES_HOST = process.env.REACT_GEONAMES_HOST || 'http://api.geonames.org';
const ZIPCODES_BY_LOC_PATH = '/findNearbyPostalCodesJSON';
const LOOKUP_ZIP_CODE_PATH = '/postalCodeLookupJSON'
const CORS_URL = process.env.REACT_APP_CORS_URL || 'https://cors-anywhere.herokuapp.com/';


export async function zipCodesbyLocation(lat, lng) {
  const query = `?lat=${lat}&lng=${lng}&username=freshmapper`;
  const response = await fetch(CORS_URL+GEONAMES_HOST+ZIPCODES_BY_LOC_PATH+query, {
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
  const query = `?postalcode=${zipCode}&country=US&username=freshmapper`;
  console.log('getZipCode URL: '+CORS_URL+GEONAMES_HOST+LOOKUP_ZIP_CODE_PATH+query);
  //const response = await fetch(CORS_URL+FRESHTRAK_API_HOST+ZIP_CODES_PATH+query, {
  const response = await fetch(CORS_URL+GEONAMES_HOST+LOOKUP_ZIP_CODE_PATH+query, {
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