import { roles } from "@/lib/enums";
import { ApplicationData, InspectionData } from "@/lib/types";
import { getApplicationNumber, sanitizeFilename } from "@/lib/utils";
import { put } from "@vercel/blob";
import * as carbone from "carbone";
import { formatDate } from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import * as path from "path";

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();
  const { application, inspection } = body as {
    application: ApplicationData;
    inspection: InspectionData;
  };
  // Carbone expects data as an object
  const { applicationNo, year, type, buildingApplication, landApplication } =
    application;

  const isBuildingApplication = type === "BUILDING";
  const parentApplication = (
    isBuildingApplication ? buildingApplication : landApplication
  )!;
  const isRecreational =
    parentApplication.landUse.landUseType === "RECREATIONAL" ? "☑" : "☐";
  const isGreening =
    parentApplication.landUse.landUseType === "GREENING" ? "☑" : "☐";
  const isCommercial =
    parentApplication.landUse.landUseType === "COMMERCIAL" ? "☑" : "☐";
  const isResidential =
    parentApplication.landUse.landUseType === "RESIDENTIAL" ? "☑" : "☐";
  const isIndustrial =
    parentApplication.landUse.landUseType === "INDUSTRIAL" ? "☑" : "☐";
  const isApproved = inspection.decision === "APPROVED" ? "☑" : "☐";
  const isRejected = inspection.decision === "REJECTED" ? "☑" : "☐";
  const isDeferred = inspection.decision === "DEFERRED" ? "☑" : "☐";
  const hasAccessForPedestrian = !isBuildingApplication
    ? `${buildingApplication?.access?.pedestrian === true ? "Has access for Pedestrian" : "There is no access for pedestrians"}`
    : undefined;
  const hasAccessForVehicular = !isBuildingApplication
    ? `${buildingApplication?.access?.vehicular === true ? ", has access for vehicles" : ""}`
    : undefined;
  const hasAccessForOpenAccessForNeighbors = !isBuildingApplication
    ? `${buildingApplication?.access?.openAccessForNeighbors === true ? ", has open access for neighbors" : ""}`
    : undefined;
  const hasAccessForExistingPath = !isBuildingApplication
    ? `${buildingApplication?.access?.existingPath === true ? ", can access existing path" : ""}`
    : undefined;
  const hasAccessForFence = !isBuildingApplication
    ? `${buildingApplication?.access?.fence === true ? ", has for structures and Fence" : ""}`
    : undefined;
  const hasNationalWater = parentApplication.site?.hasNationalWater
    ? "Yes"
    : "No";
  const hasElectricity = parentApplication.site?.hasElectricity ? "Yes" : "No";
  const inspectors = inspection.inspectors.map((i) => {
    const { title } = roles[i.role];
    return { name: i.name, title };
  });
  const size = `${parentApplication.address.size || ""} ${parentApplication.landUse.acreage && `(${parentApplication.landUse.acreage || ""}`})`;
  const d = {
    ...parentApplication,
    inspectionDate: formatDate(inspection.carriedOn, "PPPP"),
    isRecreational,
    isGreening,
    isCommercial,
    isResidential,
    isIndustrial,
    isApproved,
    isRejected,
    isDeferred,
    inspectors,
    hasAccessForExistingPath,
    hasAccessForFence,
    hasAccessForOpenAccessForNeighbors,
    hasAccessForPedestrian,
    hasAccessForVehicular,
    size,
    visitReport: inspection.visitReport,
    parcel: {
      ...parentApplication?.parcel,
      blockNumber: `Block ${parentApplication?.parcel?.blockNumber || "N/A"}`,
      plotNumber: `Plot ${parentApplication?.parcel?.plotNumber || "N/A"}`,
    },
    address: { ...parentApplication.address, size },
    site: { ...parentApplication.site, hasElectricity, hasNationalWater },
  };

  const templatePath = path.resolve(
    process.cwd(),
    isBuildingApplication
      ? "public/templates/inspection-report-building.docx"
      : "public/templates/inspection-report-land.docx",
  );

  try {
    const result: Buffer = await new Promise((resolve, reject) => {
      carbone.render(templatePath, d, {}, (err, result) => {
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
      `${getApplicationNumber(applicationNo, year, type).toUpperCase()}_Inspection report_${currentTime}.docx`,
    );

    // Upload to Blob storage
    const blob = await put(fileName, result, {
      access: "public",
      allowOverwrite: true,
      cacheControlMaxAge: 1,
    });

    // return msg
    const msg = `Successfully downloaded the inspection report`;
    return NextResponse.json(
      { message: msg, url: blob.downloadUrl, isError: false },
      { status: 200, statusText: msg },
    );
  } catch (error) {
    console.error("Error downloading inspection report:", error);
    return NextResponse.json(
      { message: `Inspection report download failed: ${error}`, isError: true },
      { status: 500, statusText: "Internal Server Error" },
    );
  }
}
