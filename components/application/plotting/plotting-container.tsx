"use client";

import UserAvatar from "@/app/(auth)/user-avatar";
import { TypographyH3 } from "@/components/headings";
import { LeafletMarker } from "@/components/leaflet-marker";
import { EmptyContainer } from "@/components/query-container/empty-container";
import ErrorContainer from "@/components/query-container/error-container";
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
import {
  Tooltip as ShadCnTooTip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ApplicationData } from "@/lib/types";
import { cn, formatNumber, getLocation } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { LatLngExpression, LatLngLiteral, PathOptions } from "leaflet";
import {
  Edit3Icon,
  ExpandIcon,
  LocateIcon,
  MapPinIcon,
  RefreshCcwIcon,
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
import { getAllOtherParcels } from "./actions";
import ButtonAddEditParcel from "./button-add-edit-parcel";

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
    applicant: {
      name: applicantName,
      contact,
      email,
      user: { avatarUrl },
    },
  } = application;
  const parentApplication = buildingApplication ?? landApplication!;
  const { address, parcel } = parentApplication;
  const addressLocation = getLocation(address);

  const thisParcelId = parcel?.id;
  const centroid = parcel?.centroid as unknown as LatLngLiteral;
  const parcelNumber = parcel?.parcelNumber ?? "";

  const grayOptions: PathOptions = { color: "gray" };
  const redOptions: PathOptions = { color: "red" };

  const query = useQuery({
    queryKey: ["all-other-parcels", thisParcelId],
    queryFn: getAllOtherParcels.bind(undefined, thisParcelId!),
  });
  const { data: allOtherParcels, status: queryStatus } = query;

  return (
    <>
      <div
        className={cn("gap-2 flex flex-col size-full ", isExpanded && "h-dvh")}
      >
        <div className="flex gap-2 items-center">
          <ButtonAddEditParcel application={application} variant={"ghost"}>
            <Edit3Icon />
          </ButtonAddEditParcel>
          <TypographyH3
            text="Plotting and Parcel for the land"
            className={cn(isExpanded && "mx-4")}
          />
        </div>

        {/* header */}
        <MapHeaderSection
          application={application}
          isExpanded={isExpanded}
          className={cn(isExpanded && "mx-4")}
        />

        {/* Error container  */}
        {queryStatus === "error" ? (
          <ErrorContainer
            errorMessage="Failed to get other parcels"
            query={query}
            className="min-h-0"
          />
        ) : queryStatus === "pending" ? (
          <EmptyContainer
            title=""
            description="...loading parcel presets"
            className="[&_svg]:hidden p-0 md:p-0"
          />
        ) : null}
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

            {/* Other sites  */}

            <LayersControl.Overlay name="Other sites" checked>
              <LayerGroup>
                {allOtherParcels &&
                  allOtherParcels.map((item) => {
                    const address = getLocation(item.address);
                    const {
                      user: { name: landOwner, avatarUrl },
                      contact,
                      email,
                    } = item.applicant;
                    const _geometry =
                      item.geometry as unknown as LatLngLiteral[];
                    return (
                      <Polygon
                        key={item.id}
                        pathOptions={grayOptions}
                        positions={_geometry}
                      >
                        <Tooltip
                          direction="bottom"
                          offset={[0, 20]}
                          opacity={1}
                          sticky
                          className="max-w-xs"
                        >
                          <div className="flex gap-2 items-center">
                            <UserAvatar avatarUrl={avatarUrl} />
                            <div>
                              <p className="text-sm md:text-lg">{landOwner}</p>
                              <p className="font-bold">{contact}</p>
                            </div>
                          </div>

                          {email && <p>{email}</p>}

                          <p>
                            <MapPinIcon className="inline size-3.5" /> {address}
                          </p>
                        </Tooltip>
                        {/* {_geometry.map((point, index) => (
                          <LeafletMarker
                            key={index}
                            position={point}
                            icon={SlashIcon}
                            iconLabel={index + 1}
                            animate={false}
                            className=" -rotate-45 *:no-underline text-destructive"
                          />
                        ))} */}
                      </Polygon>
                    );
                  })}
              </LayerGroup>
            </LayersControl.Overlay>

            {/* Location marker  */}
            <LayersControl.Overlay name="Current position" checked>
              <LeafletMarker position={centroid} iconLabel={parcelNumber}>
                <Popup>
                  <div className="gap-1 space-y-1">
                    <div className="flex gap-2 items-center">
                      <UserAvatar avatarUrl={avatarUrl} />
                      <div className="flex flex-col">
                        <span className="font-bold">
                          Site area for {applicantName}.
                        </span>
                        <span className="font-normal">{email}</span>
                        <span className="font-bold text-lg text-warning">
                          {contact}
                        </span>
                      </div>
                    </div>

                    <span>
                      <MapPinIcon className="inline text-destructive fill-destructive/50 size-5" />{" "}
                      {addressLocation}
                    </span>
                  </div>
                </Popup>
              </LeafletMarker>
            </LayersControl.Overlay>

            {/* current parcel  */}
            <LayersControl.Overlay name="This sites" checked>
              <LayerGroup>
                {parcel && parcel.geometry && (
                  <Polygon
                    pathOptions={redOptions}
                    positions={parcel.geometry as LatLngExpression[]}
                  />
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
          <div className="w-full space-y-6 mx-auto ">
            <PlottingContainer application={application} isExpanded />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export function MapHeaderSection({
  application,
  isExpanded,
  className,
}: {
  application: ApplicationData;
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

  return (
    <Item variant={isExpanded ? "muted" : "outline"} className={className}>
      <ItemContent className={cn(isExpanded && "hidden md:flex")}>
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
          <strong>Area:</strong>
          {formatNumber(parcel?.areaSqMeters || 0)} meters<sup>2</sup> (
          {formatNumber(parcel?.areaAcres || 0)} acres)
        </ItemDescription>
      </ItemContent>
      <ItemContent>
        {parcel && (
          <ItemMedia className="flex gap-2 justify-between  items-center">
            {parcel.parcelNumber ? (
              <ShadCnTooTip>
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
              </ShadCnTooTip>
            ) : null}

            {parcel.geometry ? (
              <ShadCnTooTip>
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
              </ShadCnTooTip>
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
