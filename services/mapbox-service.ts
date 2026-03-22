export const fetchAddressFromCoordinates = async (lng: number, lat: number) => {
  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.features[0]?.place_name || null;
  } catch (error) {
    return error;
  }
};
