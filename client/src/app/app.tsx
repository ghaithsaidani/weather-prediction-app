// eslint-disable-next-line @typescript-eslint/no-unused-vars
import './app.module.scss';
import { MapContainer, Marker, SVGOverlay, TileLayer } from 'react-leaflet';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import { Icon, LatLngBoundsExpression, LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';

interface PredictionBody {
  weather_code?: number;
  apparent_temperature_mean?: number;
  sunset?: number;
  rain_sum?: number;
  snowfall_sum?: number;
  precipitation_hours?: number;
  wind_gusts_10m_max?: number;
  wind_direction_10m_dominant?: number;
  et0_fao_evapotranspiration?: number;
}

export function App() {
  const [date, setDate] = useState<Date | undefined>(new Date(new Date().setDate(new Date().getDate() + 1)));
  const position: LatLngExpression = [36.8983, 10.1922];
  const bounds: LatLngBoundsExpression = [
    [36.905, 10.175],
    [36.913, 10.21],
  ];
  const [prediction, setPrediction] = useState(0);
  const day14 = new Date().setDate(new Date().getDate() + 13);
  const onClick = () => {
    let pBody: PredictionBody = {};
    const properties = [
      'weather_code',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunset',
      'rain_sum',
      'snowfall_sum',
      'precipitation_hours',
      'wind_gusts_10m_max',
      'wind_direction_10m_dominant',
      'et0_fao_evapotranspiration',
    ];
    axios
      .get(import.meta.env.VITE_APP_OPEN_METEO_API_URL)
      .then((response) => {
        const dateTimestamp = date?.getTime() ? date?.getTime() / 1000 : 0;
        const index = response.data.daily.time.indexOf(dateTimestamp);
        if (index !== 1) {
          properties.forEach((property) => {
            if (response.data.daily[property]) {
              if (
                property === 'apparent_temperature_max' ||
                property === 'apparent_temperature_min'
              ) {
                pBody.apparent_temperature_mean =
                  (response.data.daily.apparent_temperature_max[index] +
                    response.data.daily.apparent_temperature_min[index]) /
                  2;
              } else
                pBody[property as keyof PredictionBody] =
                  response.data.daily[property][index];
            }
          });
        }
      })
      .then(() => {
        axios
          .post(import.meta.env.VITE_APP_SERVER_API_URL, pBody)
          .then((response) => {
            console.log(response.data.prediction)
            setPrediction(response.data.prediction.toFixed(2));
          });
      });
  };

  return (
    <main className='p-5'>
      <div className="flex flex-col w-[50%] items-center justify-center px-64 gap-11">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          disabled={(date) => date < new Date() || date > new Date(day14)}
        />
        <Button className='w-[100%]' onClick={() => onClick()}>prédire temprature</Button>
      </div>

      <MapContainer
        center={position}
        zoom={13}
        
        scrollWheelZoom={false}
        style={{
          width: '100%',
          height: '95vh',
          zIndex: 0,
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={position}
          icon={
            new Icon({
              iconUrl: markerIconPng,
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })
          }
        />
        {prediction !== 0 && (
          <SVGOverlay bounds={bounds} className='border-1 rounded-md border-[#237cc9]'>
            <rect x="0" y="0" width="100%" height="100%" fill="#237cc9" />
            <text x="37%" y="60%" fontSize={'17px'} stroke="white">
              {prediction} °C
            </text>
          </SVGOverlay>
        )}
      </MapContainer>
    </main>
  );
}

export default App;
