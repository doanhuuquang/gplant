"use client";

import { Button } from "@/components/ui/button";
import { fetchAddressFromCoordinates } from "@/services/mapbox-service";
import { MapPin, RotateCcw } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";

const INITIAL_CENTER: [number, number] = [
  106.69529359627033, 10.777017350851123,
];
const INITIAL_ZOOM: number = 17;

interface MapboxProps {
  width?: number;
  height?: number;
  onAddressChange?: (
    address: string,
    longitude: string,
    latitude: string,
  ) => void;
  defaultLng?: number;
  defaultLat?: number;
}

export default function Mapbox({
  width = 0,
  height = 100,
  onAddressChange,
  defaultLng = INITIAL_CENTER[0],
  defaultLat = INITIAL_CENTER[1],
}: MapboxProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const [lng, setLng] = useState(defaultLng);
  const [lat, setLat] = useState(defaultLat);

  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    if (!mapContainer.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [defaultLng, defaultLat],
      zoom: INITIAL_ZOOM,
    });

    markerRef.current = new mapboxgl.Marker({ color: "red", draggable: true })
      .setLngLat([defaultLng, defaultLat])
      .addTo(map.current);

    markerRef.current.on("dragend", () => {
      const lngLat = markerRef.current!.getLngLat();
      setLng(lngLat.lng);
      setLat(lngLat.lat);
    });
  }, [defaultLng, defaultLat]);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLngLat([lng, lat]);
    }
  }, [lng, lat]);

  useEffect(() => {
    const fetchAddress = async () => {
      const placeName = await fetchAddressFromCoordinates(lng, lat);
      if (onAddressChange)
        onAddressChange(placeName, lng.toString(), lat.toString());
    };
    fetchAddress();
  }, [lng, lat, onAddressChange]);

  const handleMapResetButtonClick = () => {
    if (!map.current) return;
    map.current.flyTo({
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
    });
    setLng(INITIAL_CENTER[0]);
    setLat(INITIAL_CENTER[1]);
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const newLng = position.coords.longitude;
        const newLat = position.coords.latitude;
        setLng(newLng);
        setLat(newLat);
        if (!map.current) return;
        map.current.flyTo({
          center: [newLng, newLat],
          zoom: INITIAL_ZOOM,
        });
      });
    }
  };

  return (
    <div
      id="map"
      style={{
        width: `${width}}px`,
        height: `${height}px`,
      }}
      className="relative"
    >
      <div className="w-full h-full" ref={mapContainer} />
      <div className="absolute top-0.5 right-0.5 space-x-0.5">
        <Button
          variant={"secondary"}
          onClick={() => handleMapResetButtonClick()}
          className="rounded-none"
        >
          <RotateCcw /> RESET MAP
        </Button>

        <Button
          variant={"secondary"}
          onClick={() => handleLocateMe()}
          className="rounded-none"
        >
          <MapPin /> LOCATE ME
        </Button>
      </div>
    </div>
  );
}
