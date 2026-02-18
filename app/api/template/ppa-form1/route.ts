import { extractTextFromHTML } from "@/app/(auth)/(email)/extract-text-from-html";
import { naturesOfInterestInLand } from "@/lib/enums";
import {
  ApplicationType,
  NatureOfInterestInLand,
} from "@/lib/generated/prisma/enums";
import { ApplicationData } from "@/lib/types";
import { getApplicationNumber, sanitizeFilename } from "@/lib/utils";
import { put } from "@vercel/blob";
import * as carbone from "carbone";
import { formatDate } from "date-fns";
import * as path from "path";

export async function POST(req: Request, res: Response) {
  console.info("Downloading PPA1 form...");
  const body = await req.json();
  const application = body as ApplicationData;

  // Carbone expects data as an object
  const { type, landApplication, buildingApplication } = application;
  const isLandApplication = type === ApplicationType.LAND;
  const parentApplication = isLandApplication
    ? landApplication
    : buildingApplication;
  const { title: natureOfInterest } =
    naturesOfInterestInLand[
      parentApplication?.natureOfInterest || NatureOfInterestInLand.FREEHOLD
    ];
  const shouldHaveNewRoadAccess =
    parentApplication?.ppaForm1?.shouldHaveNewRoadAccess === true
      ? "Yes, it requires"
      : "No, it does not require";
  const doesItAbutRoadJunction =
    parentApplication?.landUse.doesItAbutRoadJunction === true
      ? "It abuts a road junction"
      : "It does not abut a road junction";
  //   application.applicant.contact
  //   parentApplication?.address.location;
  const data = {
    ...application,
    createdAt: formatDate(application.createdAt, "PPPP"),
    printedAt: formatDate(new Date(), "PPPPppp"),
    applicationNo: String(application.applicationNo).padStart(3, "0"),
    applicant: {
      ...application.applicant,
      address: extractTextFromHTML(application.applicant.address),
    },
    parentApplication: {
      ...parentApplication,
      natureOfInterest: isLandApplication
        ? `Applying for a ${natureOfInterest} land ownership`
        : `Requesting development permission on a ${natureOfInterest} land`,
      ppaForm1: { ...parentApplication?.ppaForm1, shouldHaveNewRoadAccess },
      landUse: {
        ...parentApplication?.landUse,
        doesItAbutRoadJunction,
        acreage: parentApplication?.landUse.acreage || "Not computed",
        changeOfUse:
          parentApplication?.landUse.changeOfUse ||
          "It also involves building operations",
      },
      parcel: {
        ...parentApplication?.parcel,
        blockNumber: `Block ${parentApplication?.parcel?.blockNumber || "N/A"}`,
        plotNumber: `Plot ${parentApplication?.parcel?.plotNumber || "N/A"}`,
      },
    },
  };

  const templatePath = path.resolve(
    process.cwd(),
    "public/templates/ppaForm1-template-2.docx",
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
      `${getApplicationNumber(application.applicationNo, data.year, data.type).toUpperCase()}_PPA1_FORM_${currentTime}.docx`,
    );

    // Upload to Blob storage
    const blob = await put(fileName, result, {
      access: "public",
      allowOverwrite: true,
      cacheControlMaxAge: 1,
    });

    // return msg
    const msg = `Successfully downloaded the PPA1 form`;
    return Response.json(
      { message: msg, url: blob.downloadUrl, isError: false },
      { status: 200, statusText: msg },
    );
  } catch (error) {
    console.error("Error downloading Ppa1 form:", error);
    return Response.json(
      { message: `PPA1 form download failed: ${error}`, isError: true },
      { status: 500, statusText: "Internal Server Error" },
    );
  }
}
