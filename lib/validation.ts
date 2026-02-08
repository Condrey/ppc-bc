import z from "zod";
import {
  ApplicationDecision,
  ApplicationStatus,
  ApplicationType,
  FeeAssessmentType,
  LandUseType,
  NatureOfInterestInLand,
  PaymentMethod,
  Role,
} from "./generated/prisma/enums";
import { formatPersonName } from "./utils";
const requiredString = z.string().trim();

// Signup
export const signUpSchema = z.object({
  id: z.string().optional().describe("a random UUIDv4"),
  email: z
    .email()
    .min(1, "Please an email is required")
    .describe("Email for signing up"),
  name: requiredString
    .min(1, "Please provide a name")
    .transform(formatPersonName),
  username: requiredString.optional().describe("User username for the user."),
  password: z.string().optional().describe("Password for the user."),
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
    .transform(formatPersonName),
  id: requiredString.min(1, "User id is missing"),
  username: requiredString
    .min(1, "Please add a user name")
    .describe("User username for the user.")
    .regex(/^[a-zA-Z0-9_-]+$/, "Only letters, numbers, - and _ are allowed"),
  email: z.email().trim().min(1, "A working email is required"),
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

// FeeAssessment
export const feeAssessmentSchema = z.object({
  id: z.string().optional().describe("a random UUIDv4"),
  applicationId: requiredString.min(1, "Missing application"),
  assessmentType: z.enum(FeeAssessmentType, {
    error: "Choose the correct assessment type.",
  }),
  amountAssessed: z.number({ error: "Input correct amount" }),
});
export type FeeAssessmentSchema = z.infer<typeof feeAssessmentSchema>;

// Applicant
export const applicantSchema = z
  .object({
    id: z.string().optional().describe("a random UUIDv4"),
    name: requiredString
      .min(1, "Please, name is missing.")
      .transform(formatPersonName),
    address: requiredString.min(1, "Address is missing"),
    contact: requiredString.min(1, "Address is missing"),
    email: z.string().optional().nullable(),
    userId: z.string().optional(),
    isSelfRegistration: z.boolean().optional(),
    username: requiredString.optional().describe("User username for the user."),
    password: z.string().optional().describe("Password for the user."),
  })
  .superRefine((data, ctx) => {
    if (data.isSelfRegistration) {
      if (!data.password) {
        ctx.addIssue({
          path: ["password"],
          message: "Enter your password.",
          code: "custom",
        });
      }
      if (!data.address) {
        ctx.addIssue({
          path: ["address"],
          message: "Missing address.",
          code: "custom",
        });
      }
      if (!data.contact) {
        ctx.addIssue({
          path: ["contact"],
          message: "Missing contact.",
          code: "custom",
        });
      }
      if (!data.email) {
        ctx.addIssue({
          path: ["email"],
          message: "Missing email.",
          code: "custom",
        });
      }
    }
  });
export type ApplicantSchema = z.infer<typeof applicantSchema>;

// Inspection
export const inspectionSchema = z.object({
  id: z.string().optional().describe("a random UUIDv4"),
  applicationId: requiredString.min(1, "Application can not be empty"),
  carriedOn: z.date({ error: "Put a valid date" }),
  visitReport: requiredString.min(1, "Please add a visit report"),
  decision: z.enum(ApplicationDecision),
  inspectorsIds: z.array(
    z.object({
      userId: requiredString.min(1, "Missing user id"),
    }),
  ),
});
export type InspectionSchema = z.infer<typeof inspectionSchema>;

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
  fromRoad: z.string().optional().nullable(),
  fromWetland: z.string().optional().nullable(),
  fromReserve: z.string().optional().nullable(),
  fromGreenBelt: z.string().optional().nullable(),
  fromOthers: z.string().optional().nullable(),
  fromPowerLine: z.string().optional().nullable(),
  fromLagoon: z.string().optional().nullable(),
  fromHills: z.string().optional().nullable(),
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

// Access
export const accessSchema = z.object({
  id: z.string().optional().describe("a random UUIDv4"),
  pedestrian: z.boolean(),
  vehicular: z.boolean(),
  openAccessForNeighbors: z.boolean(),
  existingPath: z.boolean(),
  structures: z.boolean(),
  fence: z.boolean(),
});
export type AccessSchema = z.infer<typeof accessSchema>;

// Parent application
export const parentApplicationSchema = z
  .object({
    id: z.string().optional().describe("a random UUIDv4"),
    application: applicationSchema.optional(),
    natureOfInterest: z.enum(NatureOfInterestInLand, {
      error: "Please indicate the nature of interest of the land.",
    }),
    address: addressSchema,
    parcel: parcelSchema.optional().nullable(),
    ppaForm1: ppaForm1Schema.optional().nullable(),
    site: siteSchema.optional().nullable(),
    inspection: inspectionSchema.optional(),
    access: accessSchema.optional(),
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
            "State the nature of land use since it will not involve building operations.",
          code: "custom",
        });
      }
    }),
  })
  .superRefine((data, ctx) => {
    if (!!data.inspection?.id) {
      if (!data.inspection.visitReport) {
        ctx.addIssue({
          path: ["inspection.visitReport"],
          message: "Missing visit report from Surveyor",
          code: "custom",
        });
      }
      if (!data.inspection.carriedOn) {
        ctx.addIssue({
          path: ["inspection.carriedOn"],
          message: "Include the date of inspection",
          code: "custom",
        });
      }
      if (!data.inspection.decision) {
        ctx.addIssue({
          path: ["inspection.decision"],
          message: "Decision made by inspectors is missing",
          code: "custom",
        });
      }
      if (data.inspection.decision === ApplicationDecision.PENDING) {
        ctx.addIssue({
          path: ["inspection.decision"],
          message:
            "The inspection decision can not now be pending, please change",
          code: "custom",
        });
      }
      if (data.inspection.inspectorsIds.length < 2) {
        ctx.addIssue({
          path: ["inspection.inspectorsIds"],
          message: "Please, indicate all the inspectors who visited site. ",
          code: "custom",
        });
      }
    }
  });
export type ParentApplicationSchema = z.infer<typeof parentApplicationSchema>;

// miscellaneous
export const emailSchema = z.object({ email: z.email().trim() });
export type EmailSchema = z.infer<typeof emailSchema>;

export const singleContentSchema = z.object({ singleContent: requiredString });
export type SingleContentSchema = z.infer<typeof singleContentSchema>;
