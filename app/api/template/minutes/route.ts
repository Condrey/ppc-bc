import {
  applicationStatuses,
  committees,
  landUseTypes,
  naturesOfInterestInLand,
  roles,
} from "@/lib/enums";
import { MeetingData } from "@/lib/types";
import { getMinuteNumber, sanitizeFilename } from "@/lib/utils";
import { put } from "@vercel/blob";
import * as carbone from "carbone";
import { formatDate } from "date-fns";
import { htmlToText } from "html-to-text";
import { NextRequest } from "next/server";
import * as path from "path";

export async function POST(req: NextRequest) {
  console.info("Downloading meeting minutes...");
  const body = await req.json();
  const meeting = body as MeetingData;

  // Carbone expects data as an object
  const { applications, committee, happeningOn, postponedOn, venue, minute } =
    meeting;
  const { title: committeeName } = committees[committee];
  const date = postponedOn
    ? formatDate(postponedOn, "PPPP")
    : formatDate(happeningOn, "PPPP");
  const time = postponedOn
    ? formatDate(postponedOn, "p")
    : formatDate(happeningOn, "p");
  const { chairedBy, writtenBy, presentMembers, agendas } = minute!;
  const _applications = applications.map((a, index) => {
    if (a.landApplication) {
      const {
        natureOfInterest,
        address: {
          cell,
          parish,
          subCounty,
          district,
          location: _preciseLocation,
          village,
          street,
        },
        parcel,
        landUse: { landUseType: _landUseType, otherLandUseType },
      } = a.landApplication;
      const { title: tenure } = naturesOfInterestInLand[natureOfInterest];
      const location = `${cell ? `${cell} cell, ` : ""}${village ? `${village} village, ` : ""}${parish ? `${parish} parish, ` : ""}${subCounty ? `${subCounty}, ` : ""} ${district}`;
      const preciseLocation = _preciseLocation
        ? `Precise location: ${_preciseLocation}`
        : "";
      const blockAndPlot = `Plot ${parcel?.plotNumber}, Block ${parcel?.blockNumber}`;
      const { title: landUseType } = landUseTypes[_landUseType];
      const user = landUseType === "OTHERS" ? otherLandUseType : landUseType;
      const { title: applicationStatus } = applicationStatuses[a.status];
      const inspection = !a.inspections.length
        ? undefined
        : a.inspections[a.inspections.length - 1];
      const report =
        (a.status === "DEFERRED" || a.status === "REJECTED") && inspection
          ? inspection.visitReport
          : "";
      return {
        id: a.id,
        sn: String(index + 1).padStart(2, "0"),
        owners: a.owners,
        tenure,
        location,
        preciseLocation,
        road: street,
        blockAndPlot,
        user,
        decision: applicationStatus,
        report,
        type: a.type,
        status: a.status,
      };
    }
    const {
      address: {
        cell,
        parish,
        subCounty,
        district,
        location: _preciseLocation,
        village,
      },
      landUse: { landUseType: _landUseType, otherLandUseType },
    } = a.buildingApplication!;
    const location = `${cell ? `${cell} cell, ` : ""}${village ? `${village} village, ` : ""}${parish ? `${parish} parish, ` : ""}${subCounty ? `${subCounty}, ` : ""} ${district}`;
    const preciseLocation = _preciseLocation
      ? `Precise location: ${location}`
      : "";
    const { formDesc } = landUseTypes[_landUseType];
    const landUse = _landUseType === "OTHERS" ? otherLandUseType : formDesc;
    const { title: applicationStatus } = applicationStatuses[a.status];
    const inspection = !a.inspections.length
      ? undefined
      : a.inspections[a.inspections.length - 1];
    const report =
      (a.status === "DEFERRED" || a.status === "REJECTED") && inspection
        ? inspection.visitReport
        : "";
    return {
      id: a.id,
      sn: String(index + 1).padStart(2, "0"),
      owners: a.owners,
      location,
      preciseLocation,
      landUse,
      recommendation: applicationStatus,
      report,
      type: a.type,
      status: a.status,
    };
  });

  const _agendas = agendas.map((a) => {
    function getFilteredApplications(
      filter: "APPROVED" | "REJECTED" | "DEFERRED",
      initialIndex: number = 0,
    ) {
      const theseApplications = _applications.filter(
        (a) => a.status === filter,
      );
      return (
        a.shouldHaveBuildingApplications
          ? theseApplications.filter((a) => a.type === "BUILDING")
          : a.shouldHaveLandApplications
            ? theseApplications.filter((a) => a.type === "LAND")
            : []
      ).map((a, index) => ({
        ...a,
        sn: String(initialIndex + index + 1).padStart(2, "0"),
      }));
    }
    return {
      id: a.id,
      title: a.title,
      minuteNumber: getMinuteNumber({
        number: a.number,
        date: new Date(postponedOn ? postponedOn : happeningOn),
        committee,
      }),
      actionBy: htmlToText(a.discussion!, { preserveNewlines: true }),
      resolution: htmlToText(a.wayForward!, { preserveNewlines: true }),
      type: a.shouldHaveBuildingApplications
        ? "BUILDING"
        : a.shouldHaveLandApplications
          ? "LAND"
          : "NONE",
      hideNormal:
        !a.shouldHaveBuildingApplications && !a.shouldHaveLandApplications,
      hasLand: a.shouldHaveLandApplications,
      hasBuilding: a.shouldHaveBuildingApplications,
      applications: a.shouldHaveBuildingApplications
        ? _applications.filter((a) => a.type === "BUILDING")
        : a.shouldHaveLandApplications
          ? _applications.filter((a) => a.type === "LAND")
          : [],
      approvedApplications: getFilteredApplications("APPROVED"),
      deferredApplications: getFilteredApplications(
        "DEFERRED",
        getFilteredApplications("APPROVED").length,
      ),
      rejectedApplications: getFilteredApplications(
        "REJECTED",
        getFilteredApplications("APPROVED").length +
          getFilteredApplications("DEFERRED").length,
      ),
    };
  });

  const data = {
    committee: committeeName.toUpperCase(),
    date,
    time,
    venue: venue.toUpperCase(),
    chairperson: { name: chairedBy.name, title: roles[chairedBy.role].title },
    secretary: { name: writtenBy.name, title: roles[writtenBy.role].title },
    members: presentMembers.map((p) => ({
      name: p.name,
      title: roles[p.role].title,
    })),
    otherMembers: [],
    agendas: _agendas,
  };

  const templatePath = path.resolve(
    process.cwd(),
    "public/templates/minutes-of-meeting.docx",
  );

  try {
    const result: Buffer = await new Promise((resolve, reject) => {
      carbone.render(templatePath, data, {}, (err, result) => {
        if (err) {
          console.error("Carbone render error:", err);
          return reject(err);
        }
        resolve(Buffer.from(result));
      });
    });

    // Give a unique fileName
    const currentTime = Date.now();
    const fileName = sanitizeFilename(
      `${meeting.title.substring(10)}_${currentTime}.docx`,
    );

    // Upload to Blob storage
    const blob = await put(fileName, result, {
      access: "public",
      allowOverwrite: true,
      cacheControlMaxAge: 1,
    });

    // return msg
    const msg = `Successfully downloaded the minutes`;
    return Response.json(
      { message: msg, url: blob.downloadUrl, isError: false },
      { status: 200, statusText: msg },
    );
  } catch (error) {
    console.error("Error downloading Minutes :", error);
    return Response.json(
      { message: `Minutes download failed: ${error}`, isError: true },
      { status: 500, statusText: "Internal Server Error" },
    );
  }
}
