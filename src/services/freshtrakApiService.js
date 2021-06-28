
//const FRESHTRAK_API_HOST = 'https://pantry-finder-api.freshtrak.com'

export async function getAgencies(zipCode) {
  //const url = `${FRESHTRAK_API_HOST}/api/agencies/?zip_code=${zipCode}`;
  
  const url = `http://localhost:8888/api/agencies?zip_code=`
  
  const response = await fetch(url+zipCode, {
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
  else 
    throw Error(response.statusText);
  });
  return(response);
}

export async function getZipCode(zipCode) {
    //const url = `${FRESHTRAK_API_HOST}/api/agencies/?zip_code=${zipCode}`;
    
    const url = `http://localhost:8888/api/zip_codes?zip_code=`
    
    const response = await fetch(url+zipCode, {
      headers: {
          'Content-Type': 'application/json',
          'accept': '*/*',
      },
      mode: 'cors'
    })
    .then(response => {
    if (response.status >= 200 && response.status <= 299) {
      console.log('getZipCode: valid status code');
      return response;
    }
    else {
      throw Error(response.statusText);
    }});
    return(response);
  }