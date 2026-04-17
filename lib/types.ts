import {
  Application,
  FeeAssessmentType,
  LandUseType,
  Meeting,
  Prisma,
} from "./generated/prisma/client";

// Applicant
export const userDataSelect = {
  id: true,
  name: true,
  avatarUrl: true,
  email: true,
  isVerified: true,
  username: true,
  role: true,
  ppcMembership: true,
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
  application: {
    include: { applicant: { include: applicantDataInclude }, documents: true },
  },
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
  application: {
    include: { applicant: { include: applicantDataInclude }, documents: true },
  },
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

// WorkflowStage
export const workflowStageDataInclude = {
  application: true,
  decidedBy: { select: userDataSelect },
} satisfies Prisma.WorkflowStageInclude;
export type WorkflowStageData = Prisma.WorkflowStageGetPayload<{
  include: typeof workflowStageDataInclude;
}>;

// Minute
export const minuteDataInclude = {
  absentMembersWithApology: { select: userDataSelect },
  agendas: true,
  chairedBy: { select: userDataSelect },
  writtenBy: { select: userDataSelect },
  presentMembers: { select: userDataSelect },
  meeting: true,
} satisfies Prisma.MinuteInclude;
export type MinuteData = Prisma.MinuteGetPayload<{
  include: typeof minuteDataInclude;
}>;

// Appeal
export const appealDataInclude = {
  submittedBy: { select: { user: { select: userDataSelect } } },
  decidedBy: { select: userDataSelect },
} satisfies Prisma.AppealInclude;
export type AppealData = Prisma.AppealGetPayload<{
  include: typeof appealDataInclude;
}>;

// Resubmission
export const resubmissionDataInclude = {
  resubmittedBy: { select: { user: { select: userDataSelect } } },
} satisfies Prisma.ResubmissionInclude;
export type ResubmissionData = Prisma.ResubmissionGetPayload<{
  include: typeof resubmissionDataInclude;
}>;

// Signature
export const signatureDataInclude = {
  signedBy: { select: userDataSelect },
  document: true,
} satisfies Prisma.SignatureInclude;
export type SignatureData = Prisma.SignatureGetPayload<{
  include: typeof signatureDataInclude;
}>;

// Document
export const documentDataInclude = {
  createdBy: { select: userDataSelect },
  signatures: { include: signatureDataInclude },
} satisfies Prisma.DocumentInclude;
export type DocumentData = Prisma.DocumentGetPayload<{
  include: typeof documentDataInclude;
}>;

// Application
export const meetingAndMinuteDataInclude = {
  minute: { include: minuteDataInclude },
} satisfies Prisma.MeetingInclude;
export type MeetingAndMinuteData = Prisma.MeetingGetPayload<{
  include: typeof meetingAndMinuteDataInclude;
}>;
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
  workflowStages: { include: workflowStageDataInclude },
  meeting: { include: meetingAndMinuteDataInclude },
  appeals: { include: appealDataInclude },
  resubmissions: { include: resubmissionDataInclude },
  documents: { include: documentDataInclude },
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
export const meetingDataInclude = {
  invitedMembers: { select: userDataSelect },
  minute: { include: minuteDataInclude },
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

export type DashboardItems = {
  admins: number;
  applicants: number;
  feesAssessment: {
    fees: {
      month: string;
      type: FeeAssessmentType;
      amount: number;
    }[];
    start: Date;
    end: Date;
  };
  landUsage: {
    type: LandUseType;
    count: number;
  }[];
  meeting: {
    recentMeeting: Meeting | undefined;
    count: number;
  };
  landApplication: {
    firstApplication: { application: Application } | undefined;
    approvedLandApplications: number;
    deferredLandApplications: number;
    rejectedLandApplications: number;
    count: number;
  };
  buildingApplication: {
    firstApplication: { application: Application } | undefined;
    approvedBuildingApplications: number;
    deferredBuildingApplications: number;
    rejectedBuildingApplications: number;
    count: number;
  };
};

export interface Attachment {
  file: File;
  extension?: string;
  mediaId?: string;
  isUploading: boolean;
}

// Comprehensive user'
const includeApplicant = {
  applicant: true,
} satisfies Prisma.ApplicationInclude;

const includeApplications = {
  application: { include: includeApplicant },
} satisfies Prisma.InspectionInclude;
const comprehensiveUserDocumentInclude = {
  createdBy: { select: userDataSelect },
} satisfies Prisma.DocumentInclude;

const includeMeetingChairpersonSecretary = {
  meeting: true,
  chairedBy: { select: userDataSelect },
  writtenBy: { select: userDataSelect },
};

const includePayments = {
  feeAssessment: true,
  receivedBy: { select: userDataSelect },
} satisfies Prisma.PaymentInclude;

const includeFeesAssessment = {
  application: true,
  assessedBy: { select: userDataSelect },
} satisfies Prisma.FeeAssessmentInclude;

export const comprehensiveUserDataSelect = {
  ...userDataSelect,
  inspections: { include: includeApplications },
  feeAssessments: {
    include: includeFeesAssessment,
  },
  payments: {
    include: includePayments,
  },
  documents: { include: includeApplications },
  // appeals: { include: includeApplications },

  chairedMinutes: {
    include: includeMeetingChairpersonSecretary,
  },
  writtenMinutes: {
    include: includeMeetingChairpersonSecretary,
  },
  minutesPresent: {
    include: includeMeetingChairpersonSecretary,
  },
  minutesAbsentWithApology: {
    include: includeMeetingChairpersonSecretary,
  },
  applicants: {
    include: {
      appeals: { include: includeApplications },
      applications: { include: { applicant: true } },
      resubmissions: { include: includeApplications },
    },
  },
} satisfies Prisma.UserSelect;
export type ComprehensiveUserData = Prisma.UserGetPayload<{
  select: typeof comprehensiveUserDataSelect;
}>;

export type ComprehensiveUserInspectionData = Prisma.InspectionGetPayload<{
  include: typeof includeApplications;
}>;
export type ComprehensiveUserFeeAssessmentData =
  Prisma.FeeAssessmentGetPayload<{ include: typeof includeFeesAssessment }>;
export type ComprehensiveUserPaymentData = Prisma.PaymentGetPayload<{
  include: typeof includePayments;
}>;
export type ComprehensiveUserDocumentData = Prisma.DocumentGetPayload<{
  include: typeof comprehensiveUserDocumentInclude;
}>;
export type ComprehensiveUserAppealData = Prisma.AppealGetPayload<{
  include: typeof includeApplications;
}>;
export type ComprehensiveUserResubmissionData = Prisma.ResubmissionGetPayload<{
  include: typeof includeApplications;
}>;
export type ComprehensiveUserApplicationData = Prisma.ApplicationGetPayload<{
  include: typeof includeApplicant;
}>;
export type ComprehensiveUserMinuteData = Prisma.MinuteGetPayload<{
  include: typeof includeMeetingChairpersonSecretary;
}>;
