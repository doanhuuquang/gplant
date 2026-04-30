"use client";

import mapboxgl from "mapbox-gl";
import { Button } from "@/components/ui/button";
import { fetchAddressFromCoordinates } from "@/lib/api/mapbox";
import { MapPin, RotateCcw } from "lucide-react";
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
  height = 320,
  onAddressChange,
  defaultLng = INITIAL_CENTER[0],
  defaultLat = INITIAL_CENTER[1],
}: MapboxProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const [lng, setLng] = useState(defaultLng);
  const [lat, setLat] = useState(defaultLat);

  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const tokenError = !process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    ? "Thiếu biến môi trường NEXT_PUBLIC_MAPBOX_TOKEN"
    : null;

  useEffect(() => {
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!mapboxToken) return;
    mapboxgl.accessToken = mapboxToken;

    if (!mapContainer.current) return;
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [defaultLng, defaultLat],
      zoom: INITIAL_ZOOM,
    });

    map.current.on("error", () => {
      setMapError(
        "Không thể tải bản đồ. Vui lòng kiểm tra token hoặc style Mapbox.",
      );
    });

    map.current.on("load", () => {
      map.current?.resize();
    });

    markerRef.current = new mapboxgl.Marker({ color: "red", draggable: true })
      .setLngLat([defaultLng, defaultLat])
      .addTo(map.current);

    markerRef.current.on("dragend", () => {
      const lngLat = markerRef.current!.getLngLat();
      setLng(lngLat.lng);
      setLat(lngLat.lat);
    });

    return () => {
      markerRef.current?.remove();
      markerRef.current = null;
      map.current?.remove();
      map.current = null;
    };
  }, [defaultLng, defaultLat]);

  useEffect(() => {
    map.current?.resize();
  }, [width, height]);

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
        width: width > 0 ? `${width}px` : "100%",
        height: `${height}px`,
      }}
      className="relative"
    >
      {(tokenError || mapError) && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted/80 text-sm text-destructive">
          {tokenError || mapError}
        </div>
      )}
      <div className="w-full h-full" ref={mapContainer} />
      <div className="absolute top-0.5 right-0.5 space-x-0.5">
        <Button
          variant={"secondary"}
          onClick={() => handleMapResetButtonClick()}
          className="rounded-none"
        >
          <RotateCcw /> ĐẶT LẠI BẢN ĐỒ
        </Button>

        <Button
          variant={"secondary"}
          onClick={() => handleLocateMe()}
          className="rounded-none"
        >
          <MapPin /> ĐỊNH VỊ TÔI
        </Button>
      </div>
    </div>
  );
}
