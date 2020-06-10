const GOOGLE_API_KEY = config.MY_KEY;

export async function getAddressFromCoords(coords) {
  const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${GOOGLE_API_KEY}`);
  if(!res.ok){
    throw new Error('Failed to fetch the address. Please try again!');
  }
  const data = await res.json();
  if(data.error_message){
    throw new Error(data.error_message);
  }

  const address = data.results[0].formatted_address;
  return address;
}

export async function getCoordsFromAddress(address) {
  const urlAddress = encodeURI(address); // returns a URL friendly string
  const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${urlAddress}&key=${GOOGLE_API_KEY}`);
  if(!res.ok){
    throw new Error('Failed to fetch coordinates. Please try again!');
  }
  const data = await res.json();
  if(data.error_message){
    throw new Error(data.error_message);
  }

  const coordinates = data.results[0].geometry.location;
  return coordinates;
}