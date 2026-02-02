import { Prisma } from "./generated/prisma/client";

// Applicant
export const userDataSelect = {
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

// Payment
export const paymentDataInclude = {
  receivedBy: true,
} satisfies Prisma.PaymentInclude;
export type PaymentData = Prisma.PaymentGetPayload<{
  include: typeof paymentDataInclude;
}>;

// Application
export const applicationDataInclude = {
  applicant: { include: applicantDataInclude },
  feeAssessments: { include: { payments: true } },
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
  site: true,
} satisfies Prisma.LandApplicationInclude;
export type LandApplicationData = Prisma.LandApplicationGetPayload<{
  include: typeof landApplicationDataInclude;
}>;

// Breadcrumb
export type BreadcrumbItem = {
  title: string;
  href?: string;
};
