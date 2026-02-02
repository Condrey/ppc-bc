import z from "zod";
import {
  ApplicationStatus,
  ApplicationType,
  LandUseType,
  NatureOfInterestInLand,
  PaymentMethod,
  Role,
} from "./generated/prisma/enums";
const requiredString = z.string().trim();

// Signup
export const signUpSchema = z.object({
  email: z
    .email()
    .min(1, "Please an email is required")
    .describe("Email for signing up"),
  name: requiredString.min(1, "Please provide a name"),
  username: requiredString
    .min(1, "You need a username")
    .describe("User username for the user.")
    .regex(/^[a-zA-Z0-9_-]+$/, "Only letters, numbers, - and _ are allowed"),
  password: requiredString
    .min(8, "Password must be at least 8 characters")
    .describe("Password for the user."),
  role: z.enum(Role, { error: "Please choose a correct role." }),
});
export type SignUpSchema = z.infer<typeof signUpSchema>;

// Login
export const loginSchema = z.object({
  username: requiredString.min(
    1,
    "Please input your username or email that you registered with.",
  ),
  password: requiredString
    .min(1, "Password is required to login")
    .describe("Password that you registered with."),
});
export type LoginSchema = z.infer<typeof loginSchema>;

export const verifyUserSchema = z.object({
  name: requiredString
    .min(1, "Name must be provided.")
    .transform((val) =>
      val.trim().replace(/\b\w/g, (char) => char.toUpperCase()),
    ),
  id: requiredString.min(1, "User id is missing"),
  username: requiredString
    .min(1, "Please add a user name")
    .describe("User username for the user.")
    .regex(/^[a-zA-Z0-9_-]+$/, "Only letters, numbers, - and _ are allowed"),
  email: requiredString.email().min(1, "A working email is required"),
  password: requiredString
    .min(8, "Password must be at least 8 characters")
    .describe("Password for the user."),
});
export type VerifyUserSchema = z.infer<typeof verifyUserSchema>;

//Utility
export const utilitySchema = z.object({
  id: z.string().optional().describe("a random UUIDv4"),
  waterSupplyMethod: z
    .string({ error: "Suggest the water supply method" })
    .trim()
    .min(1, "Suggest the water supply method"),
  sewageDisposalMethod: z
    .string({ error: "Let us know the sewage disposal method" })
    .trim()
    .min(1, "Let us know the sewage disposal method"),
  refuseDisposalMethod: z
    .string({ error: "Please indicate refuse disposal method" })
    .trim()
    .min(1, "Please indicate refuse disposal method"),
  surfaceWaterDisposalMethod: z
    .string({ error: "Please indicate surface water disposal method" })
    .trim()
    .min(1, "Please indicate surface water disposal method"),
});
export type UtilitySchema = z.infer<typeof utilitySchema>;

// PPA1 form
export const ppaForm1Schema = z.object({
  id: z.string().optional().describe("a random UUIDv4"),
  // landApplicationId: z.string().optional(),
  applicationNumber: z
    .number({ error: "Application number is missing." })
    .optional(),
  year: z.number({ error: "Year is missing" }),
  previousApplicationNo: z.number().optional().nullable(),
  shouldHaveNewRoadAccess: z.boolean(),
  utility: utilitySchema,
});
export type PpaForm1Schema = z.infer<typeof ppaForm1Schema>;

// Payment
export const paymentSchema = z.object({
  id: z.string().optional().describe("a random UUIDv4"),
  feeAssessmentId: requiredString.min(1, "Missing fees assessment"),
  amountPaid: z.number({ error: "Input correct amount" }),
  paymentMethod: z.enum(PaymentMethod, { error: "Please choose a method" }),
  referenceNumber: requiredString.min(1, "Missing reference number"),
  receivedById: z.string().optional().nullable(),
});
export type PaymentSchema = z.infer<typeof paymentSchema>;

// Applicant
export const applicantSchema = z.object({
  id: z.string().optional().describe("a random UUIDv4"),
  name: requiredString.min(1, "Please, name is missing."),
  address: requiredString.min(1, "Address is missing"),
  contact: requiredString.min(1, "Address is missing"),
  email: z.string().optional().nullable(),
  userId: z.string().optional(),
});
export type ApplicantSchema = z.infer<typeof applicantSchema>;

// Application
export const applicationSchema = z.object({
  id: z.string().optional().describe("a random UUIDv4"),
  owners: z
    .string({ error: "Please add owner(s)" })
    .trim()
    .min(1, "Please add owners"),
  applicationNo: z.number().optional(),
  year: z.number({ error: "Year is missing" }),
  type: z.enum(ApplicationType, { error: "Missing application type" }),
  status: z.enum(ApplicationStatus, {
    error: "What is the application status",
  }),
  applicant: z
    .any()
    .refine((val) => val !== undefined, {
      message: "Applicant has not been chosen",
    })
    .pipe(applicantSchema),
});

export type ApplicationSchema = z.infer<typeof applicationSchema>;

// Address
export const addressSchema = z.object({
  id: z.string().optional().describe("a random UUIDv4"),
  district: z
    .string({ error: "Please indicate the district" })
    .trim()
    .min(1, "Please indicate the district"),
  location: z.string().optional().nullable(),
  cell: z.string().optional().nullable(),
  village: z.string().optional().nullable(),
  parish: z.string().optional().nullable(),
  subCounty: z.string().optional().nullable(),
  town: z.string().optional().nullable(),
  street: z.string().optional().nullable(),
  size: z.string().optional().nullable(),
});
export type AddressSchema = z.infer<typeof addressSchema>;

// LandUse
export const landUseSchema = z
  .object({
    id: z.string().optional().describe("a random UUIDv4"),
    doesNotInvolveBuilding: z.boolean(),
    changeOfUse: z.string().optional().nullable(),
    acreage: z.string().optional().nullable(),
    doesItAbutRoadJunction: z.boolean(),
    roadJunctionDescription: z.string().optional().nullable(),
    proposedDevelopment: z.string().optional().nullable(),
    landUseType: z.enum(LandUseType, {
      error: "Please indicate the land use type.",
    }),
    otherLandUseType: z.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (
      data.landUseType === LandUseType.OTHERS &&
      (!data.otherLandUseType || data.otherLandUseType.trim() === "")
    ) {
      ctx.addIssue({
        path: ["otherLandUseType"],
        message:
          "Tell us a brief description since you selected Other land use type",
        code: "custom",
      });
    }
  });
export type LandUseSchema = z.infer<typeof landUseSchema>;

// Parcel
export const parcelSchema = z.object({
  id: z.string().optional().describe("a random UUIDv4"),
  blockNumber: z
    .string({ error: "Missing Block Number" })
    .trim()
    .min(1, "Missing Block Number"),
  plotNumber: z
    .string({ error: "Missing Block Number" })
    .trim()
    .min(1, "Missing Block Number"),
  sheetNumber: z.string().optional().nullable(),
  geometry: z.string().optional().nullable(),
  areaSqMeters: z
    .number({ error: "Input correct area in SqMeters" })
    .optional()
    .nullable(),
});
export type ParcelSchema = z.infer<typeof parcelSchema>;

// distance from feature
export const distanceFromFeaturesSchema = z.object({
  id: z.string().optional().describe("a random UUIDv4"),
  fromRoad: z.number(),
  fromWetland: z.number(),
  fromReserve: z.number(),
  fromGreenBelt: z.number(),
  fromOthers: z.number(),
});
export type DistanceFromFeaturesSchema = z.infer<
  typeof distanceFromFeaturesSchema
>;

// Site
export const siteSchema = z.object({
  id: z.string().optional().describe("a random UUIDv4"),
  sunDirection: z.string().optional().nullable(),
  prevailingWinds: z.string().optional().nullable(),
  currentUseAndSurrounding: z.string().optional().nullable(),
  percentageSizeOfBuildingAvailableSpace: z.number().optional().nullable(),
  hasNationalWater: z.boolean(),
  hasElectricity: z.boolean({ error: "Please make a selection" }),
  distanceFromFeatures: distanceFromFeaturesSchema.optional(),
});
export type SiteSchema = z.infer<typeof siteSchema>;

// Land application
export const landApplicationSchema = z.object({
  id: z.string().optional().describe("a random UUIDv4"),
  application: applicationSchema.optional(),
  natureOfInterest: z.enum(NatureOfInterestInLand, {
    error: "Please indicate the nature of interest of the land.",
  }),
  address: addressSchema,
  parcel: parcelSchema.optional().nullable(),
  ppaForm1: ppaForm1Schema.optional().nullable(),
  site: siteSchema.optional().nullable(),
  landUse: landUseSchema.superRefine((data, ctx) => {
    if (
      data.doesItAbutRoadJunction === true &&
      (!data.roadJunctionDescription ||
        data.roadJunctionDescription.trim() === "")
    ) {
      ctx.addIssue({
        path: ["roadJunctionDescription"],
        message:
          "Please describe the road junction since the land abuts a road junction.",
        code: "custom",
      });
    }
    if (
      data.doesNotInvolveBuilding === true &&
      (!data.changeOfUse || data.changeOfUse.trim() === "")
    ) {
      ctx.addIssue({
        path: ["changeOfUse"],
        message:
          "State the nature of land use since it does not involve building operations.",
        code: "custom",
      });
    }
  }),
});
export type LandApplicationSchema = z.infer<typeof landApplicationSchema>;

// miscellaneous
export const emailSchema = z.object({ email: z.email().trim() });
export type EmailSchema = z.infer<typeof emailSchema>;

export const singleContentSchema = z.object({ singleContent: requiredString });
export type SingleContentSchema = z.infer<typeof singleContentSchema>;
