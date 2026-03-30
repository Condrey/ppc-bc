"use client";
import { TypographyH3 } from "@/components/headings";
import { LeafletMarker } from "@/components/leaflet-marker";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ApplicationData } from "@/lib/types";
import {
  cn,
  formatNumber,
  getLocation,
  getPolygonArea,
  getPolygonCentroid,
} from "@/lib/utils";
import { LatLngExpression, PathOptions } from "leaflet";
import {
  ExpandIcon,
  LocateIcon,
  MapPinIcon,
  RefreshCcwIcon,
  SlashIcon,
  UserIcon,
} from "lucide-react";
import { useState } from "react";
import {
  LayerGroup,
  LayersControl,
  MapContainer,
  Polygon,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import { toast } from "sonner";

const DEFAULT_ZOOM = 25;
export default function PlottingContainer({
  application,
  isExpanded = false,
}: {
  application: ApplicationData;
  isExpanded?: boolean;
}) {
  const [expandView, setExpandView] = useState(false);
  const {
    buildingApplication,
    landApplication,
    applicant: { name: applicantName },
  } = application;
  const parentApplication = buildingApplication ?? landApplication!;
  const { address, parcel } = parentApplication;
  const addressLocation = getLocation(address);

  const grayOptions: PathOptions = { color: "gray" };
  const redOptions: PathOptions = { color: "red" };
  const polygon = [
    { lat: 51.515, lng: -0.09 },
    { lat: 51.52, lng: -0.1 },
    { lat: 51.52, lng: -0.12 },
  ];
  const otherPolygon = [
    { lat: 51.555, lng: -0.08 },
    { lat: 51.55, lng: -0.4 },
    { lat: 51.55, lng: -0.16 },
  ];
  const centroid: LatLngExpression =
    parcel?.centroidLat && parcel?.centroidLng
      ? { lat: parcel.centroidLat, lng: parcel.centroidLng }
      : getPolygonCentroid(otherPolygon)!;
  const parcelNumber = parcel?.parcelNumber ?? "";
  // Base map tile:

  return (
    <>
      <div
        className={cn("gap-2 flex flex-col size-full ", isExpanded && "h-dvh")}
      >
        <TypographyH3
          text="Plotting and Parcel for the land"
          className={cn(isExpanded && "mx-4")}
        />
        {/* header */}
        <MapHeaderSection
          application={application}
          polygon={otherPolygon}
          isExpanded={isExpanded}
          className={cn(isExpanded && "mx-4")}
        />
        {/* The map  */}

        <MapContainer
          center={centroid}
          zoom={DEFAULT_ZOOM}
          scrollWheelZoom={false}
          style={{ minHeight: "50vh", height: "100%" }}
        >
          <TileLayer
            // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <div className="leaflet-bottom leaflet-right  w-64 h-fit ">
            <div className="leaflet-control  flex flex-col gap-2 py-4  z-50 *:rounded *:text-gray-600 *:bg-white *:outline-2 *:outline-gray-400/50 *:p-2.5 *:shadow *:cursor-pointer">
              {!isExpanded && (
                <button
                  onClick={() => setExpandView((expanded) => !expanded)}
                  title="Expand the view"
                >
                  <ExpandIcon />
                </button>
              )}
              <MapControls
                defaultCenter={centroid}
                defaultZoom={DEFAULT_ZOOM}
              />
            </div>
          </div>

          <LayersControl position="topright">
            {/* Default layer */}
            <LayersControl.BaseLayer checked name="OpenStreetMap">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            </LayersControl.BaseLayer>
            {/* Satellite */}
            <LayersControl.BaseLayer name="Satellite">
              <TileLayer
                url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                subdomains={["mt0", "mt1", "mt2", "mt3"]}
              />
            </LayersControl.BaseLayer>
            {/* Terrain */}
            <LayersControl.BaseLayer name="Terrain">
              <TileLayer
                url="https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
                subdomains={["mt0", "mt1", "mt2", "mt3"]}
              />
            </LayersControl.BaseLayer>

            <LayersControl.Overlay name="Current position" checked>
              <LeafletMarker position={centroid} iconLabel={parcelNumber}>
                <Popup>This is the centroid of the land parcel.</Popup>
              </LeafletMarker>
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Other sites" checked>
              <LayerGroup>
                <Polygon pathOptions={grayOptions} positions={otherPolygon}>
                  <Tooltip
                    direction="bottom"
                    offset={[0, 20]}
                    opacity={1}
                    sticky
                  >
                    Site area for Opio tom
                  </Tooltip>
                  {otherPolygon.map((point, index) => (
                    <LeafletMarker
                      key={index}
                      position={point}
                      icon={SlashIcon}
                      iconLabel={index + 1}
                      animate={false}
                      className=" -rotate-45 *:no-underline text-destructive"
                    />
                  ))}
                </Polygon>
              </LayerGroup>
            </LayersControl.Overlay>
            <LayersControl.Overlay name="This sites" checked>
              <LayerGroup>
                {parcel && parcel.geometry && (
                  <Polygon
                    pathOptions={redOptions}
                    positions={parcel.geometry as LatLngExpression[]}
                  >
                    <Tooltip
                      direction="bottom"
                      offset={[0, 20]}
                      opacity={1}
                      permanent
                      className="max-s"
                    >
                      <p>Site area for {applicantName}.</p>
                      <p>
                        <MapPinIcon className="inline size-3.5" />{" "}
                        {addressLocation}
                      </p>
                    </Tooltip>
                  </Polygon>
                )}
              </LayerGroup>
            </LayersControl.Overlay>
          </LayersControl>
        </MapContainer>
      </div>
      <Sheet open={expandView} onOpenChange={setExpandView}>
        <SheetContent
          side="bottom"
          className="z-1000 w-full overflow-y-hidden px-0 md:p-0  h-dvh "
        >
          <div className="w-full space-y-6 mx-auto w-full">
            <PlottingContainer application={application} isExpanded />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export function MapHeaderSection({
  application,
  polygon,
  isExpanded,
  className,
}: {
  application: ApplicationData;
  polygon: { lat: number; lng: number }[];
  isExpanded: boolean;
  className?: string;
}) {
  const {
    buildingApplication,
    landApplication,
    applicant: { name: applicantName },
    owners,
  } = application;
  const parentApplication = buildingApplication ?? landApplication!;
  const { address, parcel } = parentApplication;
  const addressLocation = getLocation(address);
  const { sqm: areaInSqm, acres: areaInAcres } = getPolygonArea(polygon);

  return (
    <Item variant={isExpanded ? "muted" : "outline"} className={className}>
      <ItemContent>
        <ItemTitle>
          <UserIcon className="inline size-4" />
          {`${applicantName} and owned by`}{" "}
          <strong className="text-warning">{owners}</strong>
        </ItemTitle>
        <ItemDescription>
          <MapPinIcon className="inline size-3.5" /> {addressLocation},{" "}
          <strong>precisely, {address.location}</strong>
        </ItemDescription>
        <ItemDescription>
          <strong>Area:</strong> {formatNumber(areaInSqm)} meters<sup>2</sup> (
          {formatNumber(areaInAcres)} acres)
        </ItemDescription>
      </ItemContent>
      <ItemContent>
        {parcel && (
          <ItemMedia className="flex gap-2 justify-between  items-center">
            {parcel.parcelNumber ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={"link"}
                    className="font-sans slashed-zero"
                    onClick={() => {
                      navigator.clipboard
                        .writeText(parcel.parcelNumber!)
                        .then(() => {
                          toast.info(
                            `Parcel number ${parcel.parcelNumber} copied to clipboard`,
                          );
                        })
                        .catch((err) => {
                          console.error("Failed to copy:", err);
                          toast.error(
                            `Could not copy parcel number ${parcel.parcelNumber}`,
                          );
                        });
                    }}
                  >
                    Parcel number: {parcel.parcelNumber}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Click to copy parcel number</TooltipContent>
              </Tooltip>
            ) : null}

            {parcel.geometry ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={"link"}
                    onClick={() => {
                      navigator.clipboard
                        .writeText(JSON.stringify(parcel.geometry, null, 2))
                        .then(() => {
                          toast.info(`Geometry copied to clipboard`);
                        })
                        .catch((err) => {
                          console.error("Failed to copy:", err);
                          toast.error(`Could not copy geometry`);
                        });
                    }}
                  >
                    Copy Geometry
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Click to copy Geometry</TooltipContent>
              </Tooltip>
            ) : null}
          </ItemMedia>
        )}
      </ItemContent>
    </Item>
  );
}

interface MapControlsProps {
  defaultCenter: LatLngExpression;
  defaultZoom?: number;
}

export function MapControls({
  defaultCenter,
  defaultZoom = 13,
}: MapControlsProps) {
  const map = useMap();
  const [locating, setLocating] = useState(false);

  // Recenter to default center
  const handleRecenter = () => {
    map.setView(defaultCenter, defaultZoom, { animate: true });
  };

  // Navigate to user current location
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser");
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], defaultZoom, { animate: true });
        setLocating(false);
      },
      (error) => {
        console.error(error);
        alert("Unable to retrieve your location");
        setLocating(false);
      },
      { enableHighAccuracy: true },
    );
  };

  return (
    <>
      <button title="Refresh map" onClick={handleRecenter}>
        <span className="sr-only">Click to refresh the map</span>
        <RefreshCcwIcon />
      </button>
      <button
        title="current location"
        onClick={handleCurrentLocation}
        disabled={locating}
      >
        <span className="sr-only">
          Click to navigate to my current location
        </span>
        {locating ? <Spinner /> : <LocateIcon />}
      </button>
    </>
  );
}
