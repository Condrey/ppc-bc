import { Prisma } from "./generated/prisma/client";

// Applicant
export const userDataSelect = {
  id: true,
  name: true,
  avatarUrl: true,
  email: true,
  username: true,
  role: true,
} satisfies Prisma.UserSelect;
export type UserData = Prisma.UserGetPayload<{
  select: typeof userDataSelect;
}>;

// PPA form 1
export const ppaForm1DataInclude = {
  landApplication: {
    include: { application: { include: { applicant: true } } },
  },
  utility: true,
} satisfies Prisma.PpaForm1Include;
export type PpaForm1Data = Prisma.PpaForm1GetPayload<{
  include: typeof ppaForm1DataInclude;
}>;

// Applicant
export const applicantDataInclude = {
  user: { select: userDataSelect },
} satisfies Prisma.ApplicantInclude;
export type ApplicantData = Prisma.ApplicantGetPayload<{
  include: typeof applicantDataInclude;
}>;

// Parcel
export const parcelDataInclude = {
  buildingApplication: true,
  landApplication: true,
} satisfies Prisma.ParcelInclude;
export type ParcelData = Prisma.ParcelGetPayload<{
  include: typeof parcelDataInclude;
}>;

// Payment
export const paymentDataInclude = {
  receivedBy: true,
  feeAssessment: true,
} satisfies Prisma.PaymentInclude;
export type PaymentData = Prisma.PaymentGetPayload<{
  include: typeof paymentDataInclude;
}>;

// Inspection
export const inspectionDataInclude = {
  inspectors: { select: userDataSelect },
  documents: true,
} satisfies Prisma.InspectionInclude;
export type InspectionData = Prisma.InspectionGetPayload<{
  include: typeof inspectionDataInclude;
}>;

//Inspection Land application
export const inspectionLandApplicationDataInclude = {
  application: { include: { applicant: { include: applicantDataInclude } } },
  address: true,
  landUse: true,
  parcel: true,
  ppaForm1: { include: { utility: true, landApplication: true } },
  site: {
    include: { distanceFromFeatures: true },
  },
} satisfies Prisma.LandApplicationInclude;
export type InspectionLandApplicationData = Prisma.LandApplicationGetPayload<{
  include: typeof inspectionLandApplicationDataInclude;
}>;

//Inspection Building application
export const inspectionBuildingApplicationDataInclude = {
  application: { include: { applicant: { include: applicantDataInclude } } },
  address: true,
  landUse: true,
  parcel: true,
  ppaForm1: { include: { utility: true, buildingApplication: true } },
  site: {
    include: { distanceFromFeatures: true },
  },
  access: true,
} satisfies Prisma.BuildingApplicationInclude;
export type InspectionBuildingApplicationData =
  Prisma.BuildingApplicationGetPayload<{
    include: typeof inspectionBuildingApplicationDataInclude;
  }>;

// Fee Assessment
export const feeAssessmentDataInclude = {
  payments: true,
  application: { include: { applicant: true } },
  assessedBy: { select: userDataSelect },
} satisfies Prisma.FeeAssessmentInclude;
export type FeeAssessmentData = Prisma.FeeAssessmentGetPayload<{
  include: typeof feeAssessmentDataInclude;
}>;

// Application
export const applicationDataInclude = {
  applicant: { include: applicantDataInclude },
  feeAssessments: { include: feeAssessmentDataInclude },
  inspections: { include: inspectionDataInclude },
  landApplication: {
    include: inspectionLandApplicationDataInclude,
  },
  buildingApplication: {
    include: inspectionBuildingApplicationDataInclude,
  },
} satisfies Prisma.ApplicationInclude;
export type ApplicationData = Prisma.ApplicationGetPayload<{
  include: typeof applicationDataInclude;
}>;

// Land application
export const landApplicationDataInclude = {
  address: true,
  application: { include: applicationDataInclude },

  landUse: true,
  parcel: true,
  ppaForm1: { include: { utility: true, landApplication: true } },
  site: { include: { distanceFromFeatures: true } },
} satisfies Prisma.LandApplicationInclude;
export type LandApplicationData = Prisma.LandApplicationGetPayload<{
  include: typeof landApplicationDataInclude;
}>;

// Building application
export const buildingApplicationDataInclude = {
  address: true,
  application: { include: applicationDataInclude },
  landUse: true,
  site: { include: { distanceFromFeatures: true } },
  access: true,
  parcel: true,
  ppaForm1: { include: { utility: true, landApplication: true } },
} satisfies Prisma.BuildingApplicationInclude;
export type BuildingApplicationData = Prisma.BuildingApplicationGetPayload<{
  include: typeof buildingApplicationDataInclude;
}>;

export type ParentApplicationData =
  | BuildingApplicationData
  | LandApplicationData;

// Meeting
// Applicant
export const meetingDataInclude = {
  invitedMembers: { select: userDataSelect },
  minute: true,
  applications: { include: applicationDataInclude },
} satisfies Prisma.MeetingInclude;
export type MeetingData = Prisma.MeetingGetPayload<{
  include: typeof meetingDataInclude;
}>;

// Breadcrumb
export type BreadcrumbItem = {
  title: string;
  href?: string;
};

export type GeoJSONType =
  | { type: "Polygon"; coordinates: [number, number][][] }
  | { type: "MultiPolygon"; coordinates: [number, number][][][] };
