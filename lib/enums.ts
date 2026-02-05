import {
  ApplicationDecision,
  ApplicationStatus,
  ApplicationType,
  FeeAssessmentType,
  LandUseType,
  NatureOfInterestInLand,
  PaymentMethod,
  Role,
} from "@/lib/generated/prisma/enums";
import {
  BuildingIcon,
  FileExclamationPointIcon,
  FileScanIcon,
  FileTextIcon,
  FileXIcon,
  LucideIcon,
  MapPinnedIcon,
} from "lucide-react";

export const allApplicationTypes = Object.values(ApplicationType);
export const applicationTypes: Record<
  ApplicationType,
  { title: string; icon: LucideIcon; regIdentifier: string }
> = {
  LAND: {
    title: "Land Application",
    icon: MapPinnedIcon,
    regIdentifier: "Land",
  },
  BUILDING: {
    title: "Building Application",
    icon: BuildingIcon,
    regIdentifier: "Building",
  },
};

export const allApplicationStatuses = Object.values(ApplicationStatus);
export const applicationStatuses: Record<
  ApplicationStatus,
  {
    title: string;
    variant:
      | "default"
      | "secondary"
      | "destructive"
      | "outline"
      | "success"
      | "warning";
  }
> = {
  SUBMITTED: {
    title: "Submitted",
    variant: "default",
  },
  UNDER_REVIEW: {
    title: "Under review",
    variant: "outline",
  },
  INSPECTED: {
    title: "Inspected",
    variant: "warning",
  },
  APPROVED: {
    title: "Approved",
    variant: "success",
  },
  DEFERRED: {
    title: "Deferred",
    variant: "secondary",
  },
  REJECTED: {
    title: "Rejected",
    variant: "destructive",
  },
};

export const allApplicationDecisions = Object.values(ApplicationDecision);
export const applicationDecisions: Record<
  ApplicationDecision,
  {
    title: string;
    formTitle: string;
    icon: LucideIcon;
    className: string;
  }
> = {
  APPROVED: {
    title: "was approved",
    icon: FileTextIcon,
    className: "text-success fill-success/20",
    formTitle: "Should be approved",
  },
  DEFERRED: {
    title: "was deferred",
    icon: FileExclamationPointIcon,
    className: "text-destructive fill-destructive/20",
    formTitle: "Defer it",
  },
  REJECTED: {
    title: "was rejected",
    icon: FileXIcon,
    className: "text-destructive fill-destructive/20",
    formTitle: "Reject application",
  },
  PENDING: {
    title: "is pending",
    icon: FileScanIcon,
    className: "text-warning fill-warning/20",
    formTitle: "still pending",
  },
};

export const allNaturesOfInterestInLand = Object.values(NatureOfInterestInLand);
export const naturesOfInterestInLand: Record<
  NatureOfInterestInLand,
  {
    formDesc: string;
    title: string;
    variant:
      | "default"
      | "secondary"
      | "destructive"
      | "outline"
      | "success"
      | "warning";
  }
> = {
  REGISTERED_OWNER: {
    title: "Registered owner",
    formDesc: "I am a registered owner",
    variant: "outline",
  },
  LEASE: {
    title: "Leasehold",
    formDesc: "I want for lease",
    variant: "outline",
  },
  TENANT_BY_OCCUPANCY: {
    title: "Tenant by occupancy",
    formDesc: "I am a tenant by occupancy",
    variant: "outline",
  },
  FREEHOLD: {
    title: "Freehold",
    formDesc: "I want a freehold",
    variant: "outline",
  },
  CUSTOMARY_TENANT: {
    title: "Customary tenant",
    formDesc: "I am a customary tenant",
    variant: "outline",
  },
};

export const allLandUseTypes = Object.values(LandUseType);
export const landUseTypes: Record<
  LandUseType,
  { formDesc: string; title: string }
> = {
  COMMERCIAL: {
    title: "Commercial",
    formDesc: "For commercial use",
  },
  RESIDENTIAL: {
    title: "Residential",
    formDesc: "For residential use",
  },
  INDUSTRIAL: {
    title: "Industrial",
    formDesc: "Carryout industrial work",
  },
  RECREATIONAL: {
    title: "Recreational",
    formDesc: "Construct recreation spot",
  },
  GREENING: {
    title: "Greening",
    formDesc: "Use for greening",
  },
  OTHERS: {
    title: "Other",
    formDesc: "For other use, explain",
  },
};

export const allPaymentMethods = Object.values(PaymentMethod);
export const paymentMethods: Record<
  PaymentMethod,
  {
    title: string;
  }
> = {
  CASH: {
    title: "Cash",
  },
  BANK: {
    title: "Bank",
  },
  MOBILE_MONEY: {
    title: "Mobile money",
  },
};

export const allFeesAssessmentTypes = Object.values(FeeAssessmentType);
export const feesAssessmentTypes: Record<
  FeeAssessmentType,
  {
    title: string;
    description: string;
  }
> = {
  LAND_APPLICATION: {
    title: "Land Application",
    description: "Fee from land applications",
  },
  BUILDING_APPLICATION: {
    title: "Building Application",
    description: "Fee from building applications",
  },
  INSPECTION: {
    title: "Inspection",
    description: "Fee from inspections",
  },
  PENALTY: {
    title: "Penalty",
    description: "Fee from penalties",
  },
};

// role
export const allRoles = Object.values(Role).filter(
  (r) => r !== Role.SUPER_ADMIN,
);
export const roles: Record<Role, { title: string; hierarchy: number }> = {
  SUPER_ADMIN: {
    title: "Super Administrator",
    hierarchy: 0,
  },
  IT_OFFICER: {
    title: "IT officer",
    hierarchy: 2,
  },
  CHAIRMAN_PPC: {
    title: "Chairman PPC",
    hierarchy: 1,
  },
  CHAIRMAN_BC: {
    title: "Chairman BC",
    hierarchy: 1,
  },
  PHYSICAL_PLANNER: {
    title: "Physical Planner",
    hierarchy: 2,
  },
  ARCHITECT: {
    title: "Architect",
    hierarchy: 2,
  },
  SURVEYOR: {
    title: "Surveyor",
    hierarchy: 2,
  },
  ENVIRONMENT_OFFICER: {
    title: "Env't officer",
    hierarchy: 2,
  },
  ENGINEER: {
    title: "Engineer",
    hierarchy: 2,
  },
  REGISTRAR: {
    title: "Registrar",
    hierarchy: 3,
  },
  APPLICANT: {
    title: "Applicant",
    hierarchy: 4,
  },
};
export const myPrivileges: Record<Role, Role[]> = {
  SUPER_ADMIN: allRoles,
  CHAIRMAN_BC: allRoles,
  IT_OFFICER: allRoles,
  CHAIRMAN_PPC: [
    Role.CHAIRMAN_PPC,
    Role.PHYSICAL_PLANNER,
    Role.ENGINEER,
    Role.SURVEYOR,
    Role.ENVIRONMENT_OFFICER,
    Role.ARCHITECT,
    Role.REGISTRAR,
    Role.APPLICANT,
  ],
  PHYSICAL_PLANNER: [Role.PHYSICAL_PLANNER, Role.APPLICANT],
  ENGINEER: [Role.ENGINEER, Role.APPLICANT],
  SURVEYOR: [Role.SURVEYOR, Role.APPLICANT],
  ENVIRONMENT_OFFICER: [Role.ENVIRONMENT_OFFICER, Role.APPLICANT],
  ARCHITECT: [Role.ARCHITECT, Role.APPLICANT],
  REGISTRAR: [Role.REGISTRAR, Role.APPLICANT],
  APPLICANT: [],
};
